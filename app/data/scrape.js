var fs = require('fs'),
	http = require('http'),
    cheerio = require('cheerio'),
    request = require('./request').fnc;

var arr = [],
	_matches = [],
	
	cupName = 'uefachampionsleague',
	cupId = '1',
	season = '2016',
	daysCount = 6,
	
	// cupName = 'uefaeuro',
	// cupId = '3',
	// season = '2016',
	// daysCount = 3,
	
	matchUrl = '/library/statistic/pitchview/matches/cup='+cupId+'/season={season}/round={round}/match={matchId}.json';
	
for(var i=1; i<=daysCount; i++){
	arr.push('/'+cupName+'/season='+season+'/matches/library/day='+(i)+'/_matchesbycalendar.html');
}

Promise.all(arr.map(function(path){
	return request(path);
}))
.then(function(responses){

	return responses.map(function(html){
		var $ = cheerio.load(html);
		    
	    return {
	    	date: $('table').attr('class'),
	    	matches: $('a.lbl').get().map(function(el, i){
		        var href = $(el).attr('href'),
		        	season = href.match(/season=\d+/g)[0].split('=')[1],
		        	round = href.match(/round=\d+/g)[0].split('=')[1],
		        	matchId = href.match(/match=\d+/g)[0].split('=')[1];
		        
		        return {
		        	group: $('.gname a').eq(i).text(),
		        	url: matchUrl.replace('{season}', season).replace('{round}', round).replace('{matchId}', matchId)
		        }
		    })
	    };
	});
	
})
.then(function(matchDays){
	matchDays.forEach(function(matchDay){
		_matches = _matches.concat(matchDay.matches);
	});
	

	return Promise.all(_matches.map(function(match){
		return request(match.url);
	}));
})
.then(function(matchResponses){
	var matches = matchResponses.map(function(res, i){
		var matchData = JSON.parse(res);
		matchData.group = _matches[i].group;
		return matchData;
	});

	fs.writeFile('./scraped/'+cupName+season+'.json', JSON.stringify(matches, null, 4), 'utf8', function(err){
		if(err) throw err;
		console.log('SAVED: ' + matchResponses.length + ' matches');
	});
});