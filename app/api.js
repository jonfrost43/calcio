var _ = require('lodash'),
	fs = require('fs'),
	tablify = require('./utils').tablify;

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

		if(request.params.format === undefined){
			data = _.orderBy(data, function(match){
				return new Date(match.date).toISOString().split('T')[0];
			}, 'desc');

			data = _.groupBy(data, function(match){
				return new Date(match.date).toISOString().split('T')[0];
			});

			data = _.map(data, function(day, key){
				return {
					date: key,
					matches: day
				}
			});
		}

		if(request.params.format === 'tables'){
			data = data.reduce(tablify, []);

			data.forEach(function(table){
				table.teams
					.sort(function(a, b){
						return b.gd - a.gd;
					})
					.sort(function(a, b){
						return b.points - a.points;
					});
			});
		}

		response.send(data);
	});
}
