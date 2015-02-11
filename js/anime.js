var animeUpdater = {
	settings: null,
	optionsUrl: null,
	
	// Request anime list
	requestAnimeList: function() {
		chrome.runtime.sendMessage({}, this.onSettingsReceived.bind(this));
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

		$.getJSON("https://animereleasenotifier.com/api/animelist/" + userName, function(json) {
			var animeList = new AnimeList(json, $("#anime-list"));

			// Set number next to extension icon
			chrome.browserAction.setBadgeText({
				text: animeList.newCount.toString()
			});

			// Footer
			this.buildFooter(this.getProfileUrl(userName), animeList.listUrl);
		}.bind(this));
	},

	getProfileUrl: function(userName) {
		return 'https://animereleasenotifier.com/+' + userName;
	}
}