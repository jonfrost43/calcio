define([
	'jquery',
	'app/component',
	'lib/doT',
	'text!templates/scorers.html',
	'app/utils'
],
function($, component, doT, template, utils){

	var templateFnc = doT.template(template);

	return component({
		initialise: function($el, opts){
			this.$el = $el;

			$.ajax({
				url: '/api/uefaeuro2016/scorers'
			})
			.then(this.render.bind(this));
		},

		render: function(data){
			this.$el.html(templateFnc(data));
		}
	});

});
