var _ = require('lodash'),
	fs = require('fs');

var tablify = function(tables, match, index, array){
	var group = match.group,
		homeTeam = match.home.name,
		awayTeam = match.away.name,
		homeTeamGoals = match.home.goals ? match.home.goals.length : 0,
		awayTeamGoals = match.away.goals ? match.away.goals.length : 0;

	var getBaseValues = function(teamName){
		return {
			name: teamName,
			played: 0,
			won: 0,
			drawn: 0,
			lost: 0,
			gd: 0,
			points: 0
		};
	};

	//create group if new
	if(!tables[group]){
		tables[group] = [];
	}

	var homeData = _.findWhere(tables[group], {name: homeTeam}),
		awayData = _.findWhere(tables[group], {name: awayTeam});

	//create team if home team is new
	if(!homeData){
	//if(!tables[group][homeTeam]){
		homeData = getBaseValues(homeTeam);
		tables[group].push(homeData);
	}

	//create team if away team is new
	if(!awayData){
	//if(!tables[group][awayTeam]){
		awayData = getBaseValues(awayTeam);
		tables[group].push(awayData);
	}

	homeData.played++;
	awayData.played++;

	if(homeTeamGoals > awayTeamGoals) {
		homeData.won++;
		awayData.lost++;
	}
	else if(homeTeamGoals === awayTeamGoals) {
		homeData.drawn++;
		awayData.drawn++;
	}
	else if(homeTeamGoals < awayTeamGoals) {
		homeData.lost++;
		awayData.won++;
	}

	homeData.gd = homeData.gd + (homeTeamGoals - awayTeamGoals);
	awayData.gd = awayData.gd + (awayTeamGoals - homeTeamGoals);

	homeData.points = (homeData.won * 3) + homeData.drawn;
	awayData.points = (awayData.won * 3) + awayData.drawn;

	return tables;
};

var applyResult = function(teamData, match){

};

exports.handler = function(request, response){
	fs.readFile('app/data/' + request.params.competition + '.json', 'utf8', function(err, data){
		if(err){
			console.log(err);
			response.status(404).send('Sorry, we cannot find that!');
			return;
		}

		data = JSON.parse(data);

		if(!_.isEmpty(request.query)){
			data = _.filter(data, _.matches(request.query));
		}

		if(request.params.format === 'tables'){
			data = data.reduce(tablify, {});
		}

		response.send(data);
	});
}
