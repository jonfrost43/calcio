var _ = require('lodash'),
	fs = require('fs');

var tablify = function(tables, match, index, array){
	var teamBaseValues = {
		"played": 0,
		"won": 0,
		"drawn": 0,
		"lost": 0,
		"gd": 0,
		"points": 0,
	};

	if(!tables[match.group]){
		tables[match.group] = {};
	}

	if(!tables[match.group][match.home.name]){
		tables[match.group][match.home.name] = teamBaseValues;
	}

	if(!tables[match.group][match.away.name]){
		tables[match.group][match.away.name] = teamBaseValues;
	}

	return tables;
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
			data = data.reduce(tablify, {})
		}

		response.send(data);
	});
}
