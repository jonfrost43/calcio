var _ = require('lodash'),
	fsp = require('fs-promise'),
	http = require('http'),
	cheerio = require('cheerio'),
	commandLineArgs = require('command-line-args'),
	request = require('./request').fnc,
	normalise = require('./normalise');

var cli = commandLineArgs([
	{name: 'cup', alias: 'c', type: String, defaultValue: 'uefachampionsleague'},
	{name: 'season', alias: 's', type: String, defaultValue: '2016'},
	{name: 'day', alias: 'd', type: String, defaultValue: '1'},
]);

var options = cli.parse();

var matchDayPath = '/'+options.cup+'/season='+options.season+'/matches/library/day='+options.day+'/_matchesbycalendar.html',
	matchUrl = {
		uefachampionsleague: {
			host: 'www.uefa.com',
			path: '/library/statistic/pitchview/matches/cup=1/season={season}/round={round}/match={matchId}.json'
		},
		uefaeuropaleague: {
			host: 'www.uefa.com',
			path: '/library/statistic/pitchview/matches/cup=14/season={season}/round={round}/match={matchId}.json'
		},
		uefaeuro: {
			host: 'daaseuro2016.uefa.com',
			path: '/api/v2/football/en/matches/{matchId}'
		}
	};

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
			dateTime,
			timestamp,
			location = $('.referee_stadium').eq(i).find('.stadium_name').text();

		if(timeOpts){
			dateTime = new Date(
				parseInt(timeOpts.year),
				parseInt(timeOpts.month)-1,
				parseInt(timeOpts.day),
				parseInt(timeOpts.hours)+(new Date().getTimezoneOffset()/60),
				parseInt(timeOpts.minutes)
			);
			timestamp = Date.parse(dateTime);
		}

		return {
			id: matchId,
			dateTime: dateString,
			timestamp: timestamp,
			isFuture: timestamp > Date.now(),
			round: $('.rname a').eq(i).text(),
			group: $('.gname a').eq(i).text(),
			location: location,
			home: {
				name: $('.home a').eq(i).text()
			},
			away: {
				name: $('.away a').eq(i).text()
			},
			url: {
				host: matchUrl[options.cup].host,
				path: matchUrl[options.cup].path.replace('{season}', season).replace('{round}', round).replace('{matchId}', matchId)
			}
		}
	});
};

var getMatches = function(matches){
	return Promise.all(matches.map(function(match){
		if(match.isFuture){
			return match;
		}
		else{
			console.log('GET ' + match.home.name + ' v ' + match.away.name);
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
			console.log('UPDATED:' + data.length);
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

request({host: 'www.uefa.com', path: matchDayPath})
	.then(parseHTML)
	.then(getMatches)
	.then(normalise[options.cup])
	.then(save)
	.catch(handleError);
