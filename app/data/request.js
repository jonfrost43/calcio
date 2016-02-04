var http = require('http');

var request = function(path){
	var options = {
		host: 'www.uefa.com',
		path: path
	};
	
	return new Promise(function(resolve, reject){

		var req = http.request(options, function(res){
			console.log('STATUS: ' + res.statusCode + ' ' + options.path);

			var completeResponse = '';

			res.on('data', function(chunk){
				completeResponse += chunk;
			});

			res.on('end', function(){
				resolve(completeResponse);
			});
		});

		req.on('error', reject);

		req.end();

	});
};

exports.fnc = request;
