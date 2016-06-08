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

			this.render();
		},

		render: function(){
			this.$el.html(this.getCountdown());

			if(Date.now() < Date.UTC.apply(Date, endTime)){
				setTimeout(this.render.bind(this), 10000);
			}
		},

		getCountdown: function(){
			var now = moment.utc(),
				ko = moment.utc(Date.UTC.apply(Date, endTime)),
				html;

			if(now.isBefore(ko)){
				html = 'Euro 2016<br /> kicks off in <span class="large">'+now.to(ko, true)+'</span>'
			}
			else{
				html = '<span class="large">Euro 2016<br /> is underway!</span>'
			}

			return html;
		}
	});

});
