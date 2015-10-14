requirejs([
	'jquery',
	'app/countdown'
],
function($, countdown){
	var eurosCountdown = countdown($('.countdown'));
});
