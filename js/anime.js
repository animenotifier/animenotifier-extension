var animeUpdater = {
	// Fields
	settings: null,
	listProvider: null,
	backend: null,
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

		// Debug
		console.log(this.listProvider);
		console.log(this.backend);

		// Loading message
		this.loadingMessage();

		// Request
		this.requestStartTime = performance.now();
		this.listProvider.sendRequest(this.receiveAnimeList.bind(this));
	},

	// Receive anime list
	receiveAnimeList: function(e) {
		this.requestDuration = performance.now() - this.requestStartTime;
		console.log(this.requestDuration / 1000);

		// Status code
		if(e.target.status != 200) {
			console.log(e.target.statusText);
		}

		// Parse anime list
		this.animeList = this.listProvider.getList(e.target.response);
		this.buildHTML();
	},

	// Build HTML
	buildHTML: function() {
		var userName = this.settings["userName"];

		// List entries available?
		if(this.animeList.length == 0) {
			$(document.body).html("No anime found in the watching list of " + 
				"<a href='" + this.listProvider.getListURL(userName) + "' target='_blank'>" + userName + "</a>.<br/>" + 
				"Are you sure the <a href='" + this.optionsURL + "' target='_blank'>options</a> are correctly set up?");
		} else {
			$(document.body).html("");
		}

		// Reset badge text
		chrome.browserAction.setBadgeText({
			text: ""
		});

		// Create an element for ach anime
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

		// Footer
		this.buildFooter();
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
			//" | " + (this.requestDuration / 1000).toFixed(2) + " s" +
			" <a href='http://anichart.net/airing' target='_blank' title='Chart'><img src='http://blitzprog.org/images/anime-release-notifier/chart.png' alt='Chart'/></a>" +
			" <a href='" + this.optionsURL + "' target='_blank' title='Options'><img src='http://blitzprog.org/images/anime-release-notifier/settings.png' alt='Options'/></a>"
		); 
							
		document.body.appendChild(footer);
	},

	// Loading message
	loadingMessage: function() {
		$(document.body).append("Loading anime list for: " + this.settings["userName"] + "<br>");
	}
};