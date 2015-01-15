var animeUpdater = {
	// Components
	listProvider: null,
	airingTimeProvider: null,
	backend: null,

	// Fields
	settings: null,
	optionsURL: null,
	animeList: null,

	requestStartTime: null,
	requestDuration: null,

	// Request anime list
	requestAnimeList: function() {
		chrome.runtime.sendMessage({}, this.onSettingsReceived.bind(this));
	},

	// On settings received
	onSettingsReceived: function(response) {
		console.log(response);

		// Overwrite my settings with the newly received settings from the background thread
		this.settings = response;

		// Get URL for the options
		this.optionsURL = chrome.extension.getURL("src/options/index.html");

		// User name check
		if(this.settings["userName"].length == 0) {
			$(document.body).html("Please specify your username in the extension <a href='" + this.optionsURL + "' target='_blank'>options</a>.<br>");
			return;
		}

		// Get list provider
		this.listProvider = listProviders[this.settings["animeListProvider"]];

		// Get backend
		this.backend = backends[this.settings["animeProvider"]];

		// Get airing time provider
		this.airingTimeProvider = airingTimeProviders["old.anichart.net"];

		// Debug
		console.log(this.listProvider);
		console.log(this.backend);

		// Loading message
		this.loadingMessage();

		// List request
		this.requestStartTime = performance.now();
		this.listProvider.sendRequest(this.receiveAnimeList.bind(this));

		// Airing times request
		this.airingTimeProvider.sendRequest(this.receiveAiringTimes.bind(this));
	},

	// Receive anime list
	receiveAnimeList: function(data) {
		this.requestDuration = performance.now() - this.requestStartTime;
		console.log(this.requestDuration / 1000);

		// Parse anime list
		this.animeList = this.listProvider.getList(data);
		this.buildHTML();
	},

	// Receive airing times
	receiveAiringTimes: function() {
		console.log("Received airing times");
	},

	// Build HTML
	buildHTML: function() {
		var userName = this.settings["userName"];

		// Reset badge text
		chrome.browserAction.setBadgeText({
			text: ""
		});

		// List entries available?
		if(this.animeList.length == 0) {
			$(document.body).html("No anime found in the watching list of " + 
				"<a href='" + this.listProvider.getListURL(userName) + "' target='_blank'>" + userName + "</a>.<br/>" + 
				"Are you sure the <a href='" + this.optionsURL + "' target='_blank'>options</a> are correctly set up?");
		} else {
			$(document.body).html("");

			// Build anime list
			this.buildList();
		}

		// Footer
		this.buildFooter();

		// Get airing time for each anime
		this.airingTimeProvider.process(this.animeList);

		// Sort
		this.sortList();
	},

	// Build list
	buildList: function() {
		// Create an element for each anime
		this.animeList.forEach(function(anime) {
			// Create link
			anime.element = document.createElement("a");
			anime.element.className = "anime";
			anime.element.target = "_blank";
			anime.element.appendChild(document.createTextNode(anime.title + " "));

			// Add link to document
			document.body.appendChild(anime.element);

			// Backend
			this.backend.process(anime);
		}.bind(this));
	},

	// Build footer
	buildFooter: function() {
		var userName = this.settings["userName"];

		// Create footer
		var footer = document.createElement("div");
		footer.className = "footer";
		$(footer).html(
			"<a href='" + this.listProvider.getListURL(userName) + "' target='_blank' title='Profile'>" + userName + "</a> | " +
			this.settings["animeProvider"] + 
			" <a href='http://anichart.net/airing' target='_blank' title='Chart'><img src='http://blitzprog.org/images/anime-release-notifier/chart.png' alt='Chart'/></a>" +
			" <a href='" + this.optionsURL + "' target='_blank' title='Options'><img src='http://blitzprog.org/images/anime-release-notifier/settings.png' alt='Options'/></a>"
		); 
							
		document.body.appendChild(footer);
	},

	// Sort list
	sortList: function() {
		// Empty list?
		if(this.animeList.length == 0)
			return;

		// Pick sorting algorithm
		var sortingAlgorithm = this.getSortingAlgorithm(this.settings["sortBy"]);

		// The actual sorting
		if(sortingAlgorithm != null)
			this.animeList.sort(sortingAlgorithm);

		// Sort DOM elements and apply opacity
		var opacityEnabled = this.settings["opacityBy"] == "airingDate";
		var lastElement = this.animeList[0].element;

		this.animeList.forEach(function(entry) {
			entry.element.parentNode.insertBefore(entry.element, lastElement);
			lastElement = entry.element.nextSibling;

			if(opacityEnabled && (entry.days != 0 || entry.hours != 0 || entry.minutes != 0)) {
				var factor = entry.daysRounded;
				entry.element.style.opacity = Math.max(1.0 - (factor * factor) / 10.0, 0.2);
			}
		});
	},

	// Pick sorting algorithm
	getSortingAlgorithm: function(sortBy) {
		console.log("Sort by: " + sortBy);

		switch(sortBy) {
			// By airing date
			case "airingDate":
				return function(a, b) {
					var aUndefined = false, bUndefined = false;

					if(a.days == 0 && a.hours == 0 && a.minutes == 0)
						aUndefined = true;

					if(b.days == 0 && b.hours == 0 && b.minutes == 0)
						bUndefined = true;

					return (a.days - b.days) * 24 * 60 + (a.hours - b.hours) * 60 + (a.minutes - b.minutes) + aUndefined * 999999999 - bUndefined * 999999999;
				}

			// Alphabetically
			case "name":
				return function(a, b) {
					return a.title.localeCompare(b.title);
				}
		}
	},

	// Loading message
	loadingMessage: function() {
		$(document.body).append("Loading anime list for: " + this.settings["userName"] + "<br>");
	}
};