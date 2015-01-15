animeBackends["shanaproject.com"] = {
	host: "shanaproject.com",

	process: function(anime) {
		var searchTitle = makeAnimeSearchTitle(anime.title)
								.replace(/_/g, "+")
								.replace(/ /g, "+")
								.replace(/\+\+/g, "+");

		var shanaURL = "http://www.shanaproject.com/search/?title=" + searchTitle;

		anime.element.href = shanaURL;

		// Check new
		var req = new XMLHttpRequest();
		req.open("GET", shanaURL, true);
		req.onload = function(e) {
			var html = e.target.responseText;

			if(html.indexOf('<div class="release_episode">' + anime.nextEpisodeToWatch + '</div>') != -1) {
				markAnimeAsNew(anime);
			}
		};
		req.send(null);

		// TODO: Add eps number available
		anime.latestEpisodeNumber = -1;

		// Add episode number
		var episodesHTML;
		if(anime.latestEpisodeNumber == -1) {
			// Use watched episodes as a fallback
			//anime.latestEpisodeNumber = anime.watchedEpisodes;
			episodesHTML = "<span class='episodes latest-episode-fail'>";
		} else {
			episodesHTML = "<span class='episodes'>";
		}
		episodesHTML += "<span class='watched-episode-number'>" + anime.watchedEpisodes + "</span> "
			+ "<span class='latest-episode-number'>/ " + (anime.latestEpisodeNumber != -1 ? anime.latestEpisodeNumber : "?") + "</span> "
			+ "<span class='max-episode-part'>[" + anime.maxEpisodes + "]</span></span>";
		anime.element.innerHTML += episodesHTML;

		// Fetch image
		animeUpdater.animeListProvider.queryImage(anime, function(coverUrl) {
			anime.imageUrl = coverUrl;

			var animeImg = document.createElement("img");
			animeImg.src = anime.imageUrl;
			animeImg.alt = anime.title;

			anime.element.appendChild(animeImg);
		});
	}
};