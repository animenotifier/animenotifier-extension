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

	qualityRegEx: /([0-9]{3,4})p[^a-zA-Z]/,
	subsRegEx: /^\[([^\]]*)\]/,

	// Request anime list
	requestAnimeList: function() {
		chrome.runtime.sendMessage({}, this.onSettingsReceived.bind(this));
	},

	// On settings received
	onSettingsReceived: function(response) {
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
		this.airingTimeProvider = airingTimeProviders["anilist.co"];

		// Loading message
		this.loadingMessage();

		// Footer
		this.buildFooter();

		// List request
		this.requestStartTime = performance.now();
		this.listProvider.sendRequest(this.receiveAnimeList.bind(this));
	},

	// Receive anime list
	receiveAnimeList: function(data) {
		this.requestDuration = performance.now() - this.requestStartTime;
		console.log(this.requestDuration / 1000);

		// Parse anime list
		this.animeList = this.listProvider.getList(data);
		this.buildHTML();

		// Airing times request
		$(document).ajaxStop(function() {
			$(this).unbind("ajaxStop"); //prevent running again when other calls finish
			animeUpdater.airingTimeProvider.sendRequest(animeUpdater.receiveAiringTimes.bind(animeUpdater));
		});
	},

	// Receive airing times
	receiveAiringTimes: function() {
		if(this.animeList == null) {
			$(document).ajaxStop(function() {
				$(this).unbind("ajaxStop"); //prevent running again when other calls finish
				animeUpdater.receiveAiringTimes();
			});
			return;
		}

		this.animeList.forEach(function(anime) {
			this.airingTimeProvider.getAiringDate(anime);
		}.bind(this));
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
		var $body = $(document.body);

		//$body.append("Loading anime list for: <span class='userName'>" + this.settings["userName"] + "</span>");
		$body.append("<div class='spinner'><div class='rect1'></div><div class='rect2'></div><div class='rect3'></div><div class='rect4'></div><div class='rect5'></div></div>");
	},

	// TODO: Move this somewhere else
	// Query possible anime options
	queryPossibleAnimeOptions: function(animeTitle, subsProvider, callback) {
		var customSearchTitle = localStorage["store.settings." + animeTitle + ":search"];

		if(customSearchTitle)
			customSearchTitle = customSearchTitle.replace(/"/g, "");

		var urlObject = {};
		backends["nyaa.se"].getURLs(customSearchTitle ? customSearchTitle : animeTitle, "", subsProvider, urlObject);

		var req = new XMLHttpRequest();
		req.overrideMimeType('text/xml');
		req.open("GET", urlObject.rssUrl, true);
		req.onload = function(e) {
			var qualities = [
				{
					"value": "",
					"text": "*"
				}
			];

			var subs = [
				{
					"value": "",
					"text": "*"
				}
			];

			var qualitiesFound = {};
			var subsFound = {};

			// Find quality and subs which are available
			var itemList = e.target.responseXML.querySelectorAll("item");
			[].forEach.call(
				itemList, 
				function(item) {
					var title = item.getElementsByTagName("title")[0].innerHTML;

					// Quality
					var match = animeUpdater.qualityRegEx.exec(title);
					if(match != null) {
						var quality = match[1];

						if(!(quality in qualitiesFound)) {
							qualities.push({
								"value": quality,
								"text" : quality + "p"
							});

							qualitiesFound[quality] = true;
						}
					}

					// Subs
					var match = animeUpdater.subsRegEx.exec(title);
					if(match != null) {
						var sub = match[1];

						if(!(sub in subsFound)) {
							subs.push({
								"value": sub,
								"text" : sub
							});

							subsFound[sub] = true;
						}
					}
				}
			);

			qualities.sort(function(a, b) {
				return parseInt(a["value"]) - parseInt(b["value"]);
			});

			subs.sort(function(a, b) {
				return a["text"].localeCompare(b["text"]);
			});

			callback(animeTitle, qualities, subs);
		};
		req.send(null);
	}
};