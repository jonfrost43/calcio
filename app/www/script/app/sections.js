define([
	'jquery',
	'app/component',
	'app/nav'
],
function($, component, nav){

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

			nav.$el.on('click', 'a', function(e){
				e.preventDefault();
				this.goTo($(e.target).parent().index());
			}.bind(this));

            $sections.width(sw);
            $container.width(sw * $sections.length).css({
                'position': 'relative',
                'left': sw * currIndex * -1
            });

            $('#main').on('swipeLeft swipeRight', function(e){
                if(currIndex === 0 && e.type === 'swipeRight' || currIndex === $sections.length-1 && e.type === 'swipeLeft'){
                    return;
                }

                var direction = {
                    swipeLeft: 1,
                    swipeRight: -1
                };

                $container.css('left', sw * (currIndex + direction[e.type]) * -1);
                currIndex = currIndex + direction[e.type];
				nav.goTo(currIndex);
            });
		},

        goTo: function(index){
            if(index === currIndex || index < 0 || index > $sections.length-1){
                return;
            }

            $container.css('left', sw * index * -1);
            currIndex = index;
        }
	});

});
