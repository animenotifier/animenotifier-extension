var loadContent = function() {
	var frame = document.createElement('iframe');
	frame.id = 'frame';
	frame.frameBorder = '0';
	frame.scrolling = 'no';
	frame.src = 'https://notify.moe/+/watching/embedded';
	document.body.appendChild(frame);

	frame.onload = function() {
		document.body.removeChild(document.getElementById('loading'));
		frame.className = 'loaded';
	};
};

var init = function() {
	window.requestAnimationFrame(loadContent);
};

if(document.readyState !== 'complete')
	window.addEventListener('load', init);
else
	init();