airingTimeProviders["old.anichart.net"] = {
	html: null,
	callBack: null,

	// Send request
	sendRequest: function(callBack) {
		this.callBack = callBack;

		$.get("http://old.anichart.net/airing", this.receive.bind(this));
	},

	// Receive
	receive: function(html) {
		this.html = html;
		this.callBack();
	},

	// Parse
	process: function(animeList) {
		var html = this.html;

		var anichartAnimeInfoRegEx = /<div class="anime_info_sml">/g;
		var anichartTitleRegEx = /class="title_sml[^"']*"><a href=["'][^"']*["'] target="_blank">([^<]+)<\/a>/;
		var daysRegEx = /<span class="cd_day">([0-9]{0,3})<\/span>/;
		var hoursRegEx = /<span class="cd_hr">([0-9]{0,2})<\/span>/;
		var minutesRegEx = /<span class="cd_min">([0-9]{0,2})<\/span>/;

		var infoMatch = anichartAnimeInfoRegEx.exec(html);
		while(infoMatch != null) {
			var lastIndex = anichartAnimeInfoRegEx.lastIndex;
			var animeInfo = html.substr(lastIndex, html.indexOf('<div class="title_studio_sml">', lastIndex) - lastIndex);

			var daysMatch = daysRegEx.exec(animeInfo);
			var hoursMatch = hoursRegEx.exec(animeInfo);
			var minutesMatch = minutesRegEx.exec(animeInfo);
			var match = anichartTitleRegEx.exec(animeInfo);

			if(match != null) {
				var title = match[1].replace("-", " ").toUpperCase();
				var anime;

				for(var i = 0, len = animeList.length; i < len; i++) {
					anime = animeList[i];

					if(title == anime.title.replace("-", " ").toUpperCase().replace(/\(TV\)/g, "").trim()) {
						anime.days = daysMatch ? parseInt(daysMatch[1]) : 0;
						anime.hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
						anime.minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
						anime.daysRounded = Math.round(anime.days + (anime.hours / 24.0));

						// Display release time
						var releaseTime = "<span class='release-time'>";
						if(anime.days == 0) {
							if(anime.hours == 0) {
								if(anime.minutes != 0)
									releaseTime += plural(anime.minutes, "minute");
							} else {
								releaseTime += plural(anime.hours, "hour");
							}
						} else {
							releaseTime += plural(anime.daysRounded, "day");
						}
						releaseTime += "</span>";

						anime.element.innerHTML = releaseTime + anime.element.innerHTML;

						break;
					}
				}
			}

			infoMatch = anichartAnimeInfoRegEx.exec(html);
		}
	}
}