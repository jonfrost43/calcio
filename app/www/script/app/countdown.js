define([
	'jquery',
	'app/component'
],
function($, component){

	var endTime = '2016-06-10';

	return component({
		initialise: function($el, opts){
			if(opts){
				endTime = opts.endTime;
			}

			$el.html(this.getRemainingDays() + ' days to go');
		},

		getRemainingDays: function(){
			return Math.ceil((new Date(endTime) - new Date()) / 1000 / 60 / 60 / 24);
		}
	});

});
