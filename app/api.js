var _ = require('lodash'),
	fs = require('fs'),
	tablify = require('./utils').tablify;

exports.handler = function(request, response){
	fs.readFile('app/data/scraped/' + request.params.competition + '.json', 'utf8', function(err, data){
		if(err){
			console.log(err);
			response.status(404).send('Sorry, we cannot find that!');
			return;
		}

		data = JSON.parse(data);

		var matches = data;

		if(!_.isEmpty(request.query)){
			data = _.filter(data, _.matches(request.query));
		}

		if(request.params.format === undefined){
			data = _.orderBy(data, 'timestamp');

			data = _.groupBy(data, 'dateTime');

			data = _.map(data, function(day, key){
				return {
					date: key,
					matches: day
				}
			});
		}

		if(request.params.format === 'tables'){
			data = data.reduce(tablify, []).sort(function(a, b){
				if(a.name > b.name){
					return 1;
				}
				if(b.name > a.name){
					return -1;
				}
				return 0;
			});

			data.forEach(function(table){
				table.teams
					.sort(function(a, b){
						if(a.name > b.name){
							return 1;
						}
						if(b.name > a.name){
							return -1;
						}
						return 0;
					})
					.sort(function(a, b){
						var h2h = _.find(matches, function(m){
							return (m.home.name === a.name && m.away.name === b.name) || (m.home.name === b.name && m.away.name === a.name)
						});

						var winner;
						if(h2h.home.goals.length > h2h.away.goals.length){
							winner = h2h.home.name;
						}
						else if(h2h.home.goals.length < h2h.away.goals.length){
							winner = h2h.away.name;
						}

						if(winner === a.name){
							return -1;
						}
						if(winner === b.name){
							return 1;
						}
						return 0;
					})
					.sort(function(a, b){
						return b.gd - a.gd;
					})
					.sort(function(a, b){
						return b.points - a.points;
					});
			});
		}

		if(request.params.format === 'scorers'){
			data = _.flatten(data.filter(function(match){
				return !match.isFuture;
			})
			.map(function(match){
				match.home.goals.forEach(function(goal){
					goal.team = match.home.name;
				});
				match.away.goals.forEach(function(goal){
					goal.team = match.away.name;
				});
				return match.home.goals.concat(match.away.goals);
			}))
			.filter(function(goal){
				return goal.eventsubcode !== 'O';
			})
			.reduce(function(scorers, goal){
				var scorerIndex = _.findIndex(scorers, {id: goal.idPlayer});

				if(scorerIndex > -1){
					scorers[scorerIndex].goals.push(goal);
				}
				else{
					scorers.push({
						id: goal.idPlayer,
						name: goal.playerWebNameAlt,
						team: goal.team,
						goals: [goal]
					});
				}

				return scorers;
			}, []);

			data = _.sortBy(data, function(s){
				return s.goals.length * -1;
			});

			var counts = _.uniq(_.map(data, function(s){
				return s.goals.length;
			}));

			var scorerGroups = counts.map(function(count){
				return {
					title: count < 2 ? count + ' goal' : count + ' goals',
					scorers: data.filter(function(scorer){
						return scorer.goals.length === count;
					})
				};
			});

			data = scorerGroups;
		}

		response.send(data);
	});
}
