listProviders["hummingbird.me"] = {
	host: "hummingbird.me",
	url: "http://hummingbird.me/users/{userName}/library",
	apiURL: "https://hummingbirdv1.p.mashape.com/users/{userName}/library?status=currently-watching",

	// Send request
	sendRequest: function(callBack) {
		var requestURL = this.apiURL.replace("{userName}", animeUpdater.settings["userName"]);

		$.ajax({
			url: requestURL,
			type: 'GET',
			dataType: 'json',
			success: callBack,
			error: callBack,
			beforeSend: function(req) {
				req.setRequestHeader("X-Mashape-Key", "nr5IdgBU8pmshScE5qxAH92MmFwWp1oqx4mjsnA5igw5vcKlXu");
			}
        });
	},

	// Get anime list
	getList: function(data) {
		return data.map(function(entry) {
			if(entry.status != "currently-watching")
				return null;

			return {
				id: entry.anime.id,
				title: entry.anime.title,
				originalTitle: entry.anime.title,
				image: entry.anime.cover_image,
				watchedEpisodes: entry.episodes_watched,
				nextEpisodeToWatch: entry.episodes_watched + 1,
				maxEpisodes: entry.anime.episode_count,
				hasNewEpisodes: false,
				latestEpisodeNumber: -1,
				days: 0,
				hours: 0,
				minutes: 0
			};
		}).filter(function(n) {
			return n != undefined;
		}); ;
	},

	// Get anime list URL
	getListURL: function(userName) {
		return this.url.replace("{userName}", userName);
	},

	getImage: function(entry, callBack) {
		callBack(entry.image);
	}
};