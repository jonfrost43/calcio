define([
	'jquery',
	'app/component',
	'lib/doT',
	'text!templates/matches.html',
	'app/utils'
],
function($, component, doT, template, utils){

	var templateFnc = doT.template(template);

	return component({
		initialise: function($el, opts){
			this.$el = $el;

			$.ajax({
				url: '/api/uefaeuro2016'
			})
			.then(this.render.bind(this));
		},

		render: function(days){
			days.forEach(function(day){
				day.matches.forEach(function(match){
					match.home.score = match.home.goals ? match.home.goals.length : '???';
					match.away.score = match.away.goals ? match.away.goals.length : '???';
					match.time = new Date(match.timestamp).toString().split(' ')[4].slice(0,5);
				});
			});

			this.$el.html(templateFnc(days));
		}
	});

});
