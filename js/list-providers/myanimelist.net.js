listProviders["myanimelist.net"] = {
	host: "myanimelist.net",
	url: "http://myanimelist.net/animelist/{userName}&status=1",

	// Regular expressions
	animeRegEx: /<a href=["']\/anime\/([^\/]+)\/([^"']+)/g,
	progressRegEx: />([0-9-]+)[^0-9-]{1,10}([0-9-]+)</,
	animeImgRegEx: /<img src="(http:\/\/cdn.myanimelist.net\/images\/anime\/[^"]+)/,

	// Send request
	sendRequest: function(callBack) {
		var requestURL = this.url.replace("{userName}", animeUpdater.settings["userName"]);
		$.get(requestURL, callBack);
	},

	// Get list
	getList: function(html) {
		var animeList = [];

		if(this.ignoreAfter) {
			var ignoreAfterIndex = html.indexOf(this.ignoreAfter);
			
			if(ignoreAfterIndex != -1)
				html = html.substr(0, ignoreAfterIndex);
		}

		var animeRegEx = this.animeRegEx;
		var progressRegEx = this.progressRegEx;

		var match = animeRegEx.exec(html);
		while(match != null) {
			var watchedEpisodes = "-";
			var maxEpisodes = "-";

			var htmlSub = html.substr(animeRegEx.lastIndex);
			var progressMatch = progressRegEx.exec(html.substr(animeRegEx.lastIndex));
			if(progressMatch != null) {
				watchedEpisodes = parseInt(progressMatch[1]);
				maxEpisodes = parseInt(progressMatch[2]);

				if(!watchedEpisodes)
					watchedEpisodes = 0;

				if(!maxEpisodes)
					maxEpisodes = "-";
			}

			var animeTitle = match[2].trim().replace(/_/g, " ").replace(/-/g, " ");

			animeList.push({
				id: match[1],
				title: decodeHtmlEntities(animeTitle).replace(/&[a-zA-Z]{2,10};/g, " "),
				originalTitle: animeTitle,
				watchedEpisodes: watchedEpisodes,
				nextEpisodeToWatch: watchedEpisodes + 1,
				maxEpisodes: maxEpisodes,
				hasNewEpisodes: false,
				latestEpisodeNumber: -1,
				days: 0,
				hours: 0,
				minutes: 0
			});

			match = animeRegEx.exec(html);
		}

		return animeList;
	},

	// Get anime list URL
	getListURL: function(userName) {
		return this.url.replace("{userName}", userName);
	},

	getImage: function(entry, callBack) {
		var provider = this;
		var animeInfoRequest = new XMLHttpRequest();
		animeInfoRequest.open("GET", "http://myanimelist.net/anime/" + entry.id);
		animeInfoRequest.onload = function() {
			var html = this.responseText;

			// Get image
			var match = provider.animeImgRegEx.exec(html);
			if(match != null) {
				var coverUrl = match[1].replace("cdn.myanimelist.net", "myanimelist.net");
				callBack(coverUrl);
			}
		};
		animeInfoRequest.send(null);
	}
};