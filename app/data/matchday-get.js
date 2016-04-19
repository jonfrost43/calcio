var _ = require('lodash'),
	fsp = require('fs-promise'),
	http = require('http'),
	cheerio = require('cheerio'),
	commandLineArgs = require('command-line-args'),
	request = require('./request').fnc;

var cli = commandLineArgs([
	{name: 'cup', alias: 'c', type: String, defaultValue: 'uefachampionsleague'},
	{name: 'season', alias: 's', type: String, defaultValue: '2016'},
	{name: 'day', alias: 'd', type: String, defaultValue: '1'},
]);

var options = cli.parse();

var cupIds = {
	uefachampionsleague: '1',
	uefaeuropaleague: '14'
};

var matchDayPath = '/'+options.cup+'/season='+options.season+'/matches/library/day='+options.day+'/_matchesbycalendar.html',
	matchPath = '/library/statistic/pitchview/matches/cup='+cupIds[options.cup]+'/season={season}/round={round}/match={matchId}.json';


console.log(options);

var parseHTML = function(response){
	var $ = cheerio.load(response.body);

	return $('a.lbl').get().map(function(el, i){
		var href = $(el).attr('href'),
			season = href.match(/season=\d+/g)[0].split('=')[1],
			round = href.match(/round=\d+/g)[0].split('=')[1],
			matchId = href.match(/match=\d+/g)[0].split('=')[1],
			dateString = $('.dateT').eq(i).text().trim(),
			dateClass = $(el).closest('table').attr('class'),
			timeOpts = $('.score').eq(i).data('options'),
			dateTime = new Date(
				parseInt(timeOpts.year),
				parseInt(timeOpts.month)-1,
				parseInt(timeOpts.day),
				parseInt(timeOpts.hours),
				parseInt(timeOpts.minutes)
			),
			timestamp = Date.parse(dateTime),
			location = $('.referee_stadium').eq(i).find('.stadium_name').text();

		return {
			id: matchId,
			dateTime: dateString,
			timestamp: timestamp,
			isFuture: timestamp > Date.parse(new Date()),
			round: $('.rname a').eq(i).text(),
			group: $('.gname a').eq(i).text(),
			location: location,
			home: {
				name: $('.home a').eq(i).text()
			},
			away: {
				name: $('.away a').eq(i).text()
			},
			url: matchPath.replace('{season}', season).replace('{round}', round).replace('{matchId}', matchId)
		}
	});
};

var getMatches = function(matches){
	return Promise.all(matches.map(function(match){
		if(match.isFuture){
			return match;
		}
		else{
			return request(match.url).then(function (response) {
				match.response = response.ok ? JSON.parse(response.body) : {};
				return match;
			});
		}
	}));
};

var isOK = function(response){
	return response.ok;
};

var concatJSON = function(responses){
	return responses.filter(isOK).map(function(response){
		return JSON.parse(response.body);
	});
};

var map = function(matches){
	return matches.map(function(match){

		if(!match.response){
			return match;
		}

	    var goalsByTeam = function(team){
	        return _.filter(match.response.goals, {team: team.id}).map(function(goal){
	            return {
	                scorer: _.find(team.players, {id: goal.player}),
	                time: goal.time*1000
	            };
	        });
	    }

		return _.merge(match, {
			state: match.response ? match.response.state : null,
			home: {
				goals: match.response.goals ? goalsByTeam(match.response.homeTeam) : null
			},
			away: {
				goals: match.response.goals ? goalsByTeam(match.response.awayTeam) : null
			}
		});

	});
}

var save = function(matches){
	var path = './scraped/' + options.cup + options.season + '.json';

	fsp.access(path, fsp.R_OK | fsp.W_OK).then(function(){
		fsp.readFile(path, 'utf8').then(function(data){
			data = JSON.parse(data);

			matches.forEach(function(match, i){
				var existingIndex = data.findIndex(function(existingMatch){
					return existingMatch.id === match.id;
				});

				if(existingIndex !== -1){
					data[existingIndex] = _.merge(data[existingIndex], match);
				}
				else{
					data.push(match);
					console.log('ADDED: ' + match.home.name + ' v ' + match.away.name);
				}
			});
			console.log(data.length);
			fsp.writeFile(path, JSON.stringify(data, null, 4), 'utf8');
		});
	}, function(){
		console.log('CREATED: ' + matches.length);
		fsp.writeFile(path, JSON.stringify(matches, null, 4), 'utf8');
	});
};

var handleError = function(err){
	console.log(err);
};

request(matchDayPath)
	.then(parseHTML)
	.then(getMatches)
	.then(map)
	.then(save)
	.catch(handleError);
