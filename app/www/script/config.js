requirejs.config({
	baseUrl: '/script',
    paths: {
		jquery: 'lib/jquery',
		underscore: 'lib/underscore',
		doT: 'lib/doT',
		text: 'lib/text'
    },
	shim: {
		underscore: {
			exports: '_'
		}
	}
});
