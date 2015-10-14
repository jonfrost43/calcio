define(function(){

	return function(obj){

		return function($el, opts){

			if(typeof obj.initialise === 'function'){
				obj.initialise($el, opts);
			}

			return obj;

		};

	};

});
