requirejs.config({
	baseUrl: '/script',
    paths: {
		jquery: 'lib/zepto',
		underscore: 'lib/underscore',
		doT: 'lib/doT',
		text: 'lib/text',
		moment: 'lib/moment'
    },
	shim: {
		jquery: {
			exports: '$'
		},
		underscore: {
			exports: '_'
		}
	},
	moment: {
		noGlobal: true
	}
});
