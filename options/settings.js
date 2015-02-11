window.addEvent("domready", function () {
	// Option 1: Use the manifest:
	new FancySettings.initWithManifest(function (settings) {
		var updateURL = function() {
			var url = animeUpdater.getProfileUrl(settings.manifest.arnUserName.element.value);
			settings.manifest.previewURL.element.innerHTML = "<a href='" + url + "' target='_blank'>" + url + "</a>";
		};

		settings.manifest.arnUserName.addEvent("action", updateURL);

		if(!("store.settings.updateInterval" in localStorage))
			settings.manifest.updateInterval.set("10");

        if(!("store.settings.maxEpisodeDifference" in localStorage))
            settings.manifest.maxEpisodeDifference.set("1");

		updateURL();
	});
});
