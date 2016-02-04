var _ = require('lodash'),
    fs = require('fs'),
    data = require('./scraped/cl2015.json');

var remap = data.map(function(match){
    
    var goalsByTeam = function(team){
        return _.where(match.goals, {team: team.id}).map(function(g){
            return {
                scorer: _.findWhere(team.players, {id: g.player}),
                time: g.time*1000
            };
        });
    }

    return {
        group: match.group,
        date: match.phases[0].begin*1000,
        state: match.state,
        home: {
            name: match.homeTeam.name,
            goals: goalsByTeam(match.homeTeam)
        },
        away: {
            name: match.awayTeam.name,
            goals: goalsByTeam(match.awayTeam)
        }
        
    };
});

fs.writeFile('./remapped/cl2015.json', JSON.stringify(remap, null, 4), 'utf8', function(err){
	if(err) throw err;
	console.log('SAVED: ' + remap.length + ' matches');
});
