define([
	'jquery',
	'app/component'
],
function($, component){

	var $container;

	var notification = component({
		initialise: function($el, opts){
			if(!$el || !$el.length){
				$el = $('<div class="notification"><p></div>');
			}

			var $p = $el.find('p');

			if(!opts.text){
				opts.text = 'Blank message'
			}

			$el.on('transitionend', function(){
				if($el.hasClass('hide')){
					$el.remove();
				}
			});

			$p.text(opts.text);

			$container.append($el);

			// force a repaint, otherwise the CSS3 transition doesn't run
			$el[0].clientHeight;
			$el.addClass('show');

			setTimeout(function(){
				$el.addClass('hide');
			}, 3000);
		}
	});

	return component({
		initialise: function($el, opts){
			$container = $el;
		},

		add: function(text){
			notification(null, {
				text: text
			});
		}
	});

});
