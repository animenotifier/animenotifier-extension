listProviders["anime-planet.com"] = {
	host: "anime-planet.com",
	url: "http://www.anime-planet.com/users/",
	urlSuffix: "/anime/watching",
	ignoreAfter: "<footer",
	animeRegEx: /<a href=["']\/anime\/([^"'])>([^<]+)</g,
	progressRegEx: /<td class="tableEps">[^0-9]*([0-9]+)[^<]*<\/td>/,

	queryImage: function(entry, callBack) {
		callBack("");
	}
};