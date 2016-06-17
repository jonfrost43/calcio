var _ = require('lodash');

var uefaLibrary = function(matches){
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
};

var daaseuro2016 = function(matches){
	return matches.map(function(match){
		if(match.response){
			match = _.merge(match, {
				state: match.response ? match.response.match.statusDescr : null,
				timestamp: match.response ? Date.parse(match.response.match.dateTime.replace(' ', '')) : match.timestamp,
				home: {
					goals: match.response && match.response.match.results.scorers ? match.response.match.results.scorers.homeGoals : null
				},
				away: {
					goals: match.response && match.response.match.results.scorers ? match.response.match.results.scorers.awayGoals : null
				}
			});

			delete match.response;
		}

		return match;
	});
};

module.exports = {
	uefachampionsleague: uefaLibrary,
	uefaeuropaleague: uefaLibrary,
	uefaeuro: daaseuro2016,
};
