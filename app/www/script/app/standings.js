define([
	'jquery',
	'app/component',
	'lib/doT',
	'text!templates/standings.html'
],
function($, component, doT, template){

	var templateFnc = doT.template(template);

	return component({
		initialise: function($el, opts){
			this.$el = $el;

			$.getJSON('/api/cl2015/tables').then(this.render.bind(this));
		},

		render: function(tableData){
			this.$el.html(templateFnc(tableData));
		}
	});

});
