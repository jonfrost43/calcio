module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			sass: {
				files: ['sass/**/*.{scss,sass}','sass/_partials/**/*.{scss,sass}'],
				tasks: ['sass:dev']
			}
		},

		sass: {
			dev: {
				options: {
					style: 'expanded',
					sourceMap: true
				},
				files: {
					'app/www/style/main.css': 'sass/main.scss'
				}
			},
			prod: {
				options: {
					style: 'compressed'
				},
				files: {
					'app/www/style/main.css': 'sass/main.scss'
				}
			},
		},

		requirejs: {
			options: {
				baseUrl: 'app/www/script',
				webroot: 'script',
				config: ['config.js'],
				name: 'main',
				require: 'lib/require',
				includeAlmond: false,
				out: 'app/www/script/default.js'
			},
			dev: {
				options: {
					build: false
				}
			},
			prod: {
				options: {
					build: true
				}
			}
	    }
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-require');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('default', ['sass:prod'/*, 'requirejs:prod'*/]);

	grunt.registerTask('dev', ['sass:dev', 'watch']);

};
