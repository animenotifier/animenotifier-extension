backends["kissanime.com"] = {
	host: "kissanime.com",

	process: function(anime) {
		//var watchAnimeUrl = "http://www.watch-anime.net/" + anime.searchTitle.toLowerCase().replace(/ /g, "-") + "/" + anime.nextEpisodeToWatch;
		var kissAnimeURL = "http://kissanime.com/Anime/"
								+ anime.title.replace(/ /g, "-").replace(/\./g, "-").replace(/!/g, "").replace(/:/g, "").replace(/\(/g, "").replace(/\)/g, "")
								+ "/Episode-" + ("000" + anime.nextEpisodeToWatch).slice(-3);

		anime.element.href = kissAnimeURL;

		// Check new
		var req = new XMLHttpRequest();
		req.open("GET", kissAnimeURL, true);
		req.onload = function(e) {
			var html = e.target.responseText;

			if(html.indexOf("ContentVideo") != -1) {
				markAnimeAsNew(anime);
			}
			
		};
		req.send(null);

		// Fetch image
		animeUpdater.listProvider.getImage(anime, function(coverUrl) {
			anime.imageUrl = coverUrl;

			var animeImg = document.createElement("img");
			animeImg.src = anime.imageUrl;
			animeImg.alt = anime.title;

			anime.element.appendChild(animeImg);
		});
	}
}