define([
	'jquery',
	'underscore',
	'app/component',
	'app/nav'
],
function($, _, component, nav){

    var $container,
        $sections,
		nav,
        sw = $(document).width(),
        currIndex = 0;

	return component({
		initialise: function($el, opts){
            $container = $el.find('div.sectionsContainer');
            $sections = $container.find('section');

			nav = nav($el.find('nav'));

			$(document).on('nav/change', this.goTo);
			$(window).on('resize', this.resize);

            this.resize();

            $('#main').on('swipeLeft swipeRight', function(e){
                if(currIndex === 0 && e.type === 'swipeRight' || currIndex === $sections.length-1 && e.type === 'swipeLeft'){
                    return;
                }

                var direction = {
                    swipeLeft: 1,
                    swipeRight: -1
                };

                var index = currIndex + direction[e.type];
				this.goTo(e, index);
				$(document).trigger('section/change', currIndex);
            }.bind(this));
		},

        goTo: function(e, index){
            if(index === currIndex || index < 0 || index > $sections.length-1){
                return;
            }

            $container.css('left', sw * index * -1);
            currIndex = index;
        },

		resize: function(){
			sw = $(document).width();

			$sections.width(sw);

            $container.width(sw * $sections.length).css({
                'position': 'relative',
                'left': sw * currIndex * -1
            });
		}
	});

});
