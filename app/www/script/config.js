requirejs.config({
	baseUrl: '/script',
    paths: {
		jquery: 'lib/zepto',
		underscore: 'lib/underscore',
		doT: 'lib/doT',
		text: 'lib/text'
    },
	shim: {
		jquery: {
			exports: '$'
		},
		underscore: {
			exports: '_'
		}
	}
});
