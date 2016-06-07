define([
	'jquery',
	'app/component',
	'moment'
],
function($, component, moment){

	var endTime = ['2016', '5', '10', '19'];

	return component({
		initialise: function($el, opts){
			if(opts){
				endTime = opts.endTime;
			}

			$el.html(this.getCountdown());
		},

		getCountdown: function(){
			var now = moment.utc(),
				ko = moment.utc(Date.UTC.apply(Date, endTime)),
				html;

			if(now.isBefore(ko)){
				html = 'Euro 2016<br /> kicks off in <span class="large">'+now.to(ko, true)+'</span>'
			}
			else{
				html = 'Euro 2016<br /> is underway!'
			}

			return html;
		},

		getRemainingDays: function(){
			return Math.ceil((new Date(endTime) - new Date()) / 1000 / 60 / 60 / 24);
		}
	});

});
