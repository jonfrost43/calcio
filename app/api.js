var _ = require('lodash'),
	cl2015 = require('./data/cl2015.json');

exports.delegate = function(request, response){
	var data = cl2015;

	if(!_.isEmpty(request.query)){
		data = _.filter(cl2015, _.matches(request.query));
	}

	response.send(data);
}
