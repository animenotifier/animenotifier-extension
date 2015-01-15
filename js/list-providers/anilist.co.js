listProviders["anilist.co"] = {
	host: "anilist.co",
	url: "http://anilist.co/animelist/",
	urlSuffix: "",
	apiUrl: "http://anilist.co/api/user/",
	apiUrlSuffix: "/animelist",
	accessToken: "",

	authorize: function(callBack) {
		var authReq = new XMLHttpRequest();
		authReq.open("POST", "https://anilist.co/api/auth/access_token?grant_type=client_credentials&client_id=akyoto-wbdln&client_secret=zS3MidMPmolyHRYNOvSR1", true);
		authReq.responseType = 'json';
		authReq.onload = function(e) {
			var data = e.target.response;
			this.accessToken = data.access_token;
			callBack();
		}.bind(this);
		authReq.send(null);
	},

	overrideSend: function(req) {
		req.open("GET", animeUpdater.userAnimeListApiURL + "?access_token=" + this.accessToken, true);
		req.responseType = "json";
		//req.setRequestHeader("access_token", this.accessToken);
		req.send(null);
	},

	overrideParse: function(data) {
		return data.lists.watching.map(function(entry) {
			return {
				id: entry.anime.id,
				title: entry.anime.title_romaji,
				originalTitle: entry.anime.title_romaji,
				image: entry.anime.image_url_lge,
				watchedEpisodes: entry.episodes_watched,
				nextEpisodeToWatch: entry.episodes_watched + 1,
				maxEpisodes: entry.anime.total_episodes ? entry.anime.total_episodes : "-",
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