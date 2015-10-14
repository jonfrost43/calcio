requirejs([
	'jquery',
	'app/countdown',
	'app/matches'
],
function($, countdown, matches){
	var eurosCountdown = countdown($('.countdown'));

	var matchesList = matches($('.matches'));
});
