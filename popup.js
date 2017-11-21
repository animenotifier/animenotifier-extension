var loadContent = function() {
	var frame = document.createElement('iframe');
	frame.id = 'frame';
	frame.frameBorder = '0';
	frame.scrolling = 'no';
	frame.src = 'https://notify.moe/extension/embed';
	document.body.appendChild(frame);

	frame.onload = function() {
		document.body.removeChild(document.getElementById('loading'));
		frame.className = 'loaded';
	};
};

var setIconText = function(e) {
	var msg = JSON.parse(e.data);
	var browserAction = chrome.browserAction || browser.browserAction

	if(!browserAction)
		return;

	if(msg && msg.newAnimeCount > 0) {
		browserAction.setBadgeText({
			text: msg.newAnimeCount.toString()
		});
	} else {
		browserAction.setBadgeText({
			text: ''
		});
	}
};

var init = function() {
	window.addEventListener('message', setIconText, false);
	window.requestAnimationFrame(loadContent);
};

if(document.readyState !== 'complete')
	window.addEventListener('load', init);
else
	init();
