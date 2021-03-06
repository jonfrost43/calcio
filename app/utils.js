var _ = require('lodash');

exports.tablify = function(tables, match, index, array){
	var group = match.group,
		homeTeam = match.home.name,
		awayTeam = match.away.name,
		homeTeamGoals = match.home.goals ? match.home.goals.length : 0,
		awayTeamGoals = match.away.goals ? match.away.goals.length : 0,
		groupIndex = _.findIndex(tables, {name: group});

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

	if(!group){
		return tables;
	}

	//create group if new
	if(groupIndex === -1){
		groupIndex = tables.push({
			name: group,
			teams: []
		}) - 1;
	}

	var teams = tables[groupIndex].teams,
		homeData = _.find(teams, {name: homeTeam}),
		awayData = _.find(teams, {name: awayTeam});

	//create homeData if home team is new
	if(!homeData){
		homeData = getBaseValues(homeTeam);
		teams.push(homeData);
	}

	//create awayData if away team is new
	if(!awayData){
		awayData = getBaseValues(awayTeam);
		teams.push(awayData);
	}

	if(match.isFuture){
		return tables;
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
}
