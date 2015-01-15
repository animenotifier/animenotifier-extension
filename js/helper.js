// Set object (store objects in localStorage)
Storage.prototype.setObject = function(key, value) {
	this.setItem(key, JSON.stringify(value));
}

// Get object (retrieve objects from localStorage)
Storage.prototype.getObject = function(key) {
	var value = this.getItem(key);
	return value && JSON.parse(value);
}

// Replace special anime search names
var replaceSpecialAnimeSearchNames = function(animeTitle) {
	if(animeTitle in specialAnimeSearchNames)
		return specialAnimeSearchNames[animeTitle];
	else
		return animeTitle;
};

// Plural
var plural = function(count, noun) {
	return count + " " + (count == 1 ? noun : noun + "s");
};

// Make anime search title
var makeAnimeSearchTitle = function(animeTitle) {
	return removeHtmlEntities(replaceSpecialAnimeSearchNames(animeTitle))
			.replace(/:/g, "")
			.replace(/&/g, "")
			.replace(/\(TV\)/g, "")
			.replace(/[^a-zA-Z0-9!']+/g, " ");
};

// Encode HTML entities
var encodeHtmlEntities = function(str) {
	var buf = [];
	for (var i=str.length-1;i>=0;i--) {
		buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
	}
	return buf.join('');
};

// Decode HTML entities
var decodeHtmlEntities = function(str) {
	return str.replace(/&#(\d+);/g, function(match, dec) {
		return String.fromCharCode(dec);
	});
};

// Remove HTML entities
var removeHtmlEntities = function(str) {
	return str.replace(/&#\d+;/g, " ").replace(/&[a-zA-Z]{2,10};/g, " ");
};

// Mark anime as new
var markAnimeAsNew = function(anime) {
	anime.element.className += " new-episodes";
	anime.hasNewEpisodes = true;
	chrome.browserAction.getBadgeText({}, function(text) {
		count = parseInt(text);

		if(isNaN(count))
			count = 0;

		chrome.browserAction.setBadgeText({
			text: (count + 1).toString()
		});
	});
};