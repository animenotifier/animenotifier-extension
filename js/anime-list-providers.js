var animeListProviders = {
	// Myanimelist
	"myanimelist.net": {
		host: "myanimelist.net",
		url: "http://myanimelist.net/animelist/",
		urlSuffix: "&status=1",
		//ignoreAfter: 'class="header_completed"',
		animeRegEx: /<a href=["']\/anime\/([^\/]+)\/([^"']+)/g,
		progressRegEx: />([0-9-]+)[^0-9-]{1,10}([0-9-]+)</,
		animeImgRegEx: /<img src="(http:\/\/cdn.myanimelist.net\/images\/anime\/[^"]+)/,

		queryImage: function(entry, callBack) {
			var provider = animeListProviders["myanimelist.net"];
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
	},

	// Anilist
	"anilist.co": {
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
	},

	// Hummingbird
	"hummingbird.me": {
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
	},

	// Anime Planet
	"anime-planet.com": {
		host: "anime-planet.com",
		url: "http://www.anime-planet.com/users/",
		urlSuffix: "/anime/watching",
		ignoreAfter: "<footer",
		animeRegEx: /<a href=["']\/anime\/([^"'])>([^<]+)</g,
		progressRegEx: /<td class="tableEps">[^0-9]*([0-9]+)[^<]*<\/td>/,

		queryImage: function(entry, callBack) {
			callBack("");
		}
	}
};
