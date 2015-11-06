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
			console.log(this);

			$activeEl = $el.find('.active');
			$links = $el.find('a');

			$activeEl
				.width($links.eq(activeIndex).width())
				.css({
					left: $links.eq(activeIndex).position().left
				})
				.removeClass('hidden');

			$el.on('click', 'a', function(e){
				e.preventDefault();
				this.goTo($(e.target).parent().index());
			}.bind(this));

		},

		goTo: function(index){
			console.log(index);

			$activeEl
				.width($links.eq(index).width())
				.css({
					left: $links.eq(index).position().left
				});

			activeIndex = index;
		}
	});

});
