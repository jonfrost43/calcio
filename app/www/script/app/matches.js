define([
	'jquery',
	'app/component'
],
function($, component){

	return component({
		initialise: function($el, opts){
			$.getJSON('/api/cl2015').then(function(response){
				console.log(response);
			});

			$.getJSON('/api/cl2016').then(function(response){
				console.log(response);
			});

			$.getJSON('/api/cl2015?group=A').then(function(response){
				console.log(response);
			});

			$.getJSON('/api/cl2015?group=B').then(function(response){
				console.log(response);
			});

			//$el.html();
		}
	});

});
