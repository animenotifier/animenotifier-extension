airingTimeProviders["anilist.co"] = {
	searchURL: "http://anilist.co/api/anime/search/{animeTitle}",
	airingDateURL: "http://anilist.co/api/anime/{animeId}/airing",

	// Send request
	sendRequest: function(callBack) {
		listProviders["anilist.co"].authorize(callBack);
	},

	// Get airing date
	getAiringDate: function(anime) {
		var anilist = listProviders["anilist.co"];

		if(animeUpdater.listProvider != anilist) {
			var fullAccessToken = "?access_token=" + anilist.accessToken;

			var requestURL = this.searchURL.replace("{animeTitle}", encodeURIComponent('"' + anime.title.replace("/", " ") + '"')) + fullAccessToken;

			// Find anilist ID
			$.getJSON(requestURL, function(results) {
				var anilistId = results[0].id;
				this.getAiringDateForId(anime, anilistId);
			}.bind(this));
		} else {
			this.getAiringDateForId(anime, anime.id);
		}
	},

	getAiringDateForId: function(anime, anilistId) {
		var anilist = listProviders["anilist.co"];
		var fullAccessToken = "?access_token=" + anilist.accessToken;

		var requestDatesURL = this.airingDateURL.replace("{animeId}", anilistId) + fullAccessToken;

		$.getJSON(requestDatesURL, function(dates) {
			if(anime.latestEpisodeNumber == -1)
				return;

			var timeStamp = dates[anime.latestEpisodeNumber + 1];

			// Release time
			var releaseTime = "<span class='release-time'>";

			// Already aired
			if(typeof timeStamp == 'undefined') {
				var date = dates[anime.maxEpisodes];

				if(typeof date == 'undefined')
					return;

				var year = new Date(date * 1000).getFullYear();
				releaseTime += "<span class='date-in-the-past'>" + year + "</span>";
			} else {
				var now = new Date();
				var airingDate = new Date(timeStamp * 1000);
				var timeDiff = airingDate.getTime() - now.getTime();

				anime.days = parseInt(timeDiff / (24 * 3600 * 1000));
				anime.hours = parseInt(timeDiff / (3600 * 1000));
				anime.minutes = parseInt(timeDiff / 1000);
				anime.daysRounded = Math.round(anime.days + (anime.hours / 24.0));

				if(anime.days == 0) {
					if(anime.hours == 0) {
						if(anime.minutes != 0)
							releaseTime += this.past(plural(anime.minutes, "minute"));
					} else {
						releaseTime += this.past(plural(anime.hours, "hour"));
					}
				} else {
					releaseTime += this.past(plural(anime.daysRounded, "day"));
				}
			}

			releaseTime += "</span>";

			// Add release time
			$(anime.element).prepend(releaseTime);

			animeUpdater.sortList();
		}.bind(this));
	},

	// Add "ago" if it's negative
	past: function(timeString) {
		if(timeString[0] == '-')
			return timeString.replace("-", "") + " ago";

		return timeString;
	},

	// Parse
	process: function(animeList) {
		
	}
}