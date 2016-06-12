var http = require('http');

var request = function(options){
	return new Promise(function(resolve, reject){

		var req = http.request(options, function(res){
			console.log('STATUS: ' + res.statusCode + ' ' + options.path);

			var completeResponse = '';

			res.on('data', function(chunk){
				completeResponse += chunk;
			});

			res.on('end', function(){
				resolve({
					ok: res.statusCode === 200,
					body: completeResponse
				});
			});
		});

		req.on('error', reject);

		req.end();

	});
};

exports.fnc = request;
