requirejs([
	'jquery',
	'app/notifications',
	'app/countdown',
	'app/matches',
	'app/standings'
],
function($, notifications, countdown, matches, standings){
	var notifications = notifications($('.notifications'));

	countdown($('.countdown'));

	matches($('.matches'));

	standings($('.standings'));

	$(document).on('click tap longTap swipeLeft swipeRight', function(e){
		notifications.add(e.type);
	});
});
