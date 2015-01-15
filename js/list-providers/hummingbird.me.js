listProviders["hummingbird.me"] = {
	host: "hummingbird.me",
	url: "http://hummingbird.me/users/",
	urlSuffix: "/library",
	apiUrl: "https://hummingbirdv1.p.mashape.com/users/",
	apiUrlSuffix: "/library?status=currently-watching",

	overrideSend: function(req) {
		req.open("GET", animeUpdater.userAnimeListApiURL, true);
		req.responseType = "json";
		req.setRequestHeader("X-Mashape-Key", "nr5IdgBU8pmshScE5qxAH92MmFwWp1oqx4mjsnA5igw5vcKlXu");
		req.send(null);
	},

	overrideParse: function(data) {
		return data.map(function(entry) {
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
		});
	},

	queryImage: function(entry, callBack) {
		callBack(entry.image);
	}
};