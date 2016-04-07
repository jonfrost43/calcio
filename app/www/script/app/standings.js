define([
	'jquery',
	'app/component',
	'lib/doT',
	'text!templates/standings.html',
	'app/utils'
],
function($, component, doT, template, utils){

	var templateFnc = doT.template(template);

	return component({
		initialise: function($el, opts){
			this.$el = $el;

			$.ajax({
				url: '/api/uefaeuro2016/tables'
			})
			.then(this.render.bind(this));
		},

		render: function(tableData){
			this.$el.html(templateFnc(tableData));
		}
	});

});
