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
				url: '/api/uefachampionsleague2016'
			})
			.then(this.render.bind(this));
		},

		render: function(days){
			days.forEach(function(day){
				day.matches.forEach(function(match){
					match.home.score = match.home.goals ? match.home.goals.length : '???';
					match.away.score = match.away.goals ? match.away.goals.length : '???';
				});
			});

			this.$el.html(templateFnc(days));
		}
	});

});
