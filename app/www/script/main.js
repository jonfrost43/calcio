requirejs([
	'jquery',
	'app/notifications',
	'app/sections',
	'app/countdown',
	'app/matches',
	'app/standings'
],
function($, notifications, sections, countdown, matches, standings){
	var notifications = notifications($('.notifications'));

	var sections = sections($('#main'));

	countdown($('.countdown'));

	matches($('.matches'));

	standings($('.standings'));

	$(document).on('notify', function(e, message){
		notifications.add(message);
	});

	if('serviceWorker' in navigator){

		navigator.serviceWorker.register('/sw.js')
			.then(function(registration){
				notifications.add('ServiceWorker registered');
				console.log('ServiceWorker registration successful with scope: ', registration.scope);
			})
			.catch(function(err){
				notifications.add('ServiceWorker registration failed');
				console.log('ServiceWorker registration failed: ', err);
			});

	}
});
