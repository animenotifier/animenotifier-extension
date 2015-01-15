listProviders["anilist.co"] = {
	host: "anilist.co",
	url: "http://anilist.co/animelist/{userName}",
	apiURL: "http://anilist.co/api/user/{userName}/animelist",

	// Access token
	accessToken: "",

	// Authorize
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

	// Send request
	sendRequest: function(callBack) {
		this.authorize(function() {
			var requestURL = this.apiURL.replace("{userName}", animeUpdater.settings["userName"]) + "?access_token=" + this.accessToken;
			console.log(requestURL);

			var req = new XMLHttpRequest();
			req.onload = callBack;
			req.open("GET", requestURL, true);
			req.responseType = "json";
			req.send(null);
		}.bind(this));
	},

	// Get anime list
	getList: function(data) {
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

	// Get anime list URL
	getListURL: function(userName) {
		return this.url.replace("{userName}", userName);
	},

	// Get image
	getImage: function(entry, callBack) {
		callBack(entry.image);
	}
};