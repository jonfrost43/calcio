var _ = require('lodash'),
	fs = require('fs');

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

		response.send(data);
	});
}
