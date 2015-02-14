var animeUpdater = {
	settings: null,
	optionsUrl: null,
	notificationIdToLink: {},
	
	// Request anime list
	requestAnimeList: function() {
		chrome.runtime.sendMessage({intent: "getSettings"}, this.onSettingsReceived.bind(this));
	},

	// Build footer
	buildFooter: function(profileUrl, listUrl) {
		var userName = this.settings["arnUserName"];

		// Create footer
		var footer = document.createElement("div");
		footer.className = "footer";

		$(footer).html(
			"<a href='" + profileUrl + "' target='_blank' title='Profile'>" + userName + "</a> | " +
			"<a href='" + listUrl + "' target='_blank' title='Anime List'>Edit List</a>" +
			" <a href='http://anichart.net/airing' target='_blank' title='Chart'><img src='http://blitzprog.org/images/anime-release-notifier/chart.png' alt='Chart'/></a>" +
			" <a href='" + this.optionsUrl + "' target='_blank' title='Options'><img src='http://blitzprog.org/images/anime-release-notifier/settings.png' alt='Options'/></a>"
		); 
							
		document.body.appendChild(footer);
	},

	// On settings received
	onSettingsReceived: function(response) {
		// Overwrite my settings with the newly received settings from the background thread
		this.settings = response;

		// Get URL for the options
		this.optionsUrl = chrome.extension.getURL("options/index.html");

		var userName = this.settings["arnUserName"];

		// User name check
		if(userName.length == 0) {
			$(document.body).html("Please specify your username in the extension <a href='" + this.optionsUrl + "' target='_blank'>options</a>.<br>");
			return;
		}

		$animeList = $("#anime-list");
		$animeList.html("<div class='loading'><div class='rect1'></div><div class='rect2'></div><div class='rect3'></div><div class='rect4'></div><div class='rect5'></div></div>");

		$.getJSON("https://animereleasenotifier.com/api/animelist/" + userName, function(json) {
			var animeList = new AnimeList(json, $animeList, parseInt(this.settings["maxEpisodeDifference"]), function(anime) {
				// Notification options
				var notificationOptions = {
					type: "basic",
					title: anime.title + " [Ep. " + anime.episodes.available + "]",
					iconUrl: anime.image,
					priority: 1,
					message: "New episode available\n",
					buttons: [{
						title: "View"
					}]
				};

				// Display notification
				chrome.notifications.create("", notificationOptions, function(notificationId) {
					// When the notification is created we receive a notification ID.
					// Store the link for that ID in a global map
					animeUpdater.notificationIdToLink[notificationId] = anime.actionUrl;

					chrome.runtime.sendMessage({
						intent: "setLink",
						notificationId: notificationId,
						link: anime.actionUrl
					});

				});
			});

			// Set number next to extension icon
			chrome.browserAction.setBadgeText({
				text: animeList.newCount != 0 ? animeList.newCount.toString() : ''
			});

			// Footer
			this.buildFooter(this.getProfileUrl(userName), animeList.listUrl);
		}.bind(this));
	},

	getProfileUrl: function(userName) {
		return 'https://animereleasenotifier.com/+' + userName;
	}
};