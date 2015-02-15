// Settings
var settings = new Store("settings", {
	"arnUserName": "",
	"updateInterval": "10",
	"maxEpisodeDifference": "1"
});

// Background update fuction
var backgroundUpdate = function() {
	animeUpdater.onSettingsReceived(settings.toObject());
};

// Send settings to the frontend
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.intent == "getSettings") {
		sendResponse(settings.toObject());
	} else if(request.intent == "setLink") {
		animeUpdater.notificationIdToLink[request.notificationId] = request.link;
	}
});

// Notification: Button click
chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonId) {
	if(buttonId === 0) {
		var link = animeUpdater.notificationIdToLink[notificationId];
		window.open(link);
	}
});

chrome.alarms.onAlarm.addListener(function (alarm) {
	console.log("Updating anime list in the background...");
	backgroundUpdate();
});

// Init
document.addEventListener('DOMContentLoaded', function() {
	backgroundUpdate();

	// Get update interval
	var updateInterval = parseInt(settings.toObject()["updateInterval"]);
	if(isNaN(updateInterval) || updateInterval < 1)
		updateInterval = 10;

	// Update consistently
	chrome.alarms.create("ARN Alarm", {
		periodInMinutes: updateInterval
	});
});