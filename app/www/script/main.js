requirejs([
	'jquery',
	'app/countdown',
	'app/matches',
	'app/standings'
],
function($, countdown, matches, standings){
	var eurosCountdown = countdown($('.countdown'));

	var matchesList = matches($('.matches'));

	var standings = standings($('.standings'));
});
