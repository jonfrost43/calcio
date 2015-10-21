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

	$(document).on('click tap longTap swipeLeft swipeRight', function(e){
		var notificationEl = document.createElement('p');
		notificationEl.innerHTML = e.type;
		$('.notifications').append(notificationEl);

		setTimeout(function(){
			$(notificationEl).remove()
		}, 3000);
	});
});
