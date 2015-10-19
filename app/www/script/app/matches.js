define([
	'jquery',
	'app/component',
	'lib/doT',
	'text!templates/matches.html'
],
function($, component, doT, template){

	var templateFnc = doT.template(template);

	return component({
		initialise: function($el, opts){
			this.$el = $el;

			$.getJSON('/api/cl2015').then(this.render.bind(this));
		},

		render: function(matches){
			matches.forEach(function(match){
				match.home.score = match.home.goals ? match.home.goals.length : 0;
				match.away.score = match.away.goals ? match.away.goals.length : 0;
			});
			this.$el.html(templateFnc(matches));
		}
	});

});