document.addEventListener('DOMContentLoaded', function () {
	if(localStorage.htmlCache) {
		$(document.body).html(localStorage.htmlCache);
	}

	animeUpdater.requestAnimeList();
});