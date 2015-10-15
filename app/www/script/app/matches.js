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

		render: function(data){
			this.$el.html(templateFnc({matches: data}));
		}
	});

});
