define([
	'jquery',
	'app/component'
],
function($, component){

	var $container;

	var notification = component({
		initialise: function($el, opts){
			if(!$el || !$el.length){
				$el = $('<p>');
			}

			if(!opts.text){
				opts.text = 'Blank message'
			}

			$el.text(opts.text);

			$container.append($el);

			setTimeout(function(){
				$el.remove()
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
