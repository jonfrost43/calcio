define([
	'jquery',
	'app/component'
],
function($, component){

	var activeIndex = 0,
		$activeEl,
		$links;

	return component({
		initialise: function($el, opts){
			$activeEl = $el.find('.active');
			$links = $el.find('a');

			$activeEl
				.width($links.eq(activeIndex).width())
				.css({
					left: $links.eq(activeIndex).position().left
				})
				.removeClass('hidden');

			$el.on('click', 'a', function(e){
				var index = $(e.target).parent().index();
				e.preventDefault();
				this.goTo(e, index);
				$(document).trigger('nav/change', index);
			}.bind(this));

			$(document).on('section/change', this.goTo);
			$(window).on('resize', this.resize);
		},

		goTo: function(e, index){
			$activeEl
				.width($links.eq(index).width())
				.css({
					left: $links.eq(index).position().left
				});

			activeIndex = index;
		},

		resize: function(){
			$activeEl.css({
				left: $links.eq(activeIndex).position().left
			});
		}
	});

});
