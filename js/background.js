// if you checked "fancy-settings" in extensionizr.com, uncomment this lines
var settings = new Store("settings", {
	"arnUserName": "",
	"updateInterval": "10",
	"maxEpisodeDifference": "1"
});

//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	//chrome.pageAction.show(sender.tab.id);
	sendResponse(settings.toObject());
});

chrome.notifications.onButtonClicked.addListener(function(notificationId, btnIdx) {
	if(btnIdx === 0) {
		var link = animeUpdater.notificationIdToLink[notificationId];
		window.open(link);
	}
});

// Background update fuction
var backgroundUpdate = function() {
	animeUpdater.onSettingsReceived(settings.toObject());
};

document.addEventListener('DOMContentLoaded', function() {
	backgroundUpdate();

	// Get update interval
	var updateInterval = parseInt(settings.toObject()["updateInterval"]);
	if(isNaN(updateInterval) || updateInterval < 1)
		updateInterval = 10;

	// Update consistently
	window.setInterval(function() {
		console.log("Updating anime list in the background...");
		backgroundUpdate();
	}, 60 * 1000 * updateInterval);
});