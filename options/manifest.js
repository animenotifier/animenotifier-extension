// SAMPLE
this.manifest = {
	"name": "Anime Release Notifier settings",
	"icon": "/icons/icon-32.png",
	"settings": [
		{
			"tab": i18n.get("Basic"),
			"group": "Account",
			"name": "arnUserName",
			"id": "arnUserName",
			"type": "text",
			"label": "Username:",
			"text": "Your username on animereleasenotifier.com"
		},
		{
			"tab": i18n.get("Basic"),
			"group": "URL",
			"name": "previewURL",
			"type": "description",
			"text": ""
		},
		{
			"tab": i18n.get("Advanced"),
			"group": "Notifier",
			"name": "updateInterval",
			"type": "slider",
			"label": "Update interval:",
			"max": 60,
			"min": 10,
			"step": 1,
			"display": true,
			"displayModifier": function(value) {
				return value + " minutes";
			}
		},
		{
			"tab": i18n.get("Advanced"),
			"group": "Notifier",
			"name": "maxEpisodeDifference",
			"type": "slider",
			"label": "Max episode difference:",
			"max": 30,
			"min": 1,
			"step": 1,
			"display": true,
			"displayModifier": function(value) {
				return value + " episodes";
			}
		},
		{
			"tab": i18n.get("Advanced"),
			"group": "Notifier",
			"name": "maxEpisodeDifferenceDescription",
			"type": "description",
			"text": "The <strong>update interval</strong> indicates how often the updater will check for new releases. The <strong>max episode difference</strong> will tell the updater to only notify you when you're this many or less episodes behind the latest."
		},
		{
			"tab": i18n.get("Donations"),
			"group": "PayPal",
			"name": "donate",
			"type": "description",
			"text": "<a href='http://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=DADU374FK8X2J' target='_blank'><img src='https://battleofmages.com/images/donate-paypal.png' alt='Donate'/></a>"
		},
		{
			"tab": i18n.get("Donations"),
			"group": "Top donators",
			"name": "donatorList",
			"type": "description",
			"text": "You'll be mentioned here if you support this project.<br/><br/><ul class='donators'>" + 
					"<li><div class='donation-amount'>10,00 €</div> <a href='http://anilist.co/user/drill' target='_blank'>drill</a> (Anilist)</li>" + 
					"<li><div class='donation-amount'>7,35 €</div> <a href='http://anilist.co/user/Izzy' target='_blank'>Izzy</a> (Anilist)</li>" + 
					"<li><div class='donation-amount'>5,00 €</div> <a href='http://anilist.co/user/Josh' target='_blank'>Josh Star</a> (Anilist Admin)</li>" +
					"<li><div class='donation-amount'>1,00 €</div> <a href='http://myanimelist.net/profile/Mr_SkiZZeX' target='_blank'>Mr_SkiZZeX</a> (MAL)</li>" +
					"<li><div class='donation-amount'>1,00 €</div> <a href='http://myanimelist.net/profile/manolito62' target='_blank'>manolito62</a> (MAL)</li>" +
					"</ul>"
		}
	],
	"alignment": [
		[
			"arnUserName"
		],
		[
			"updateInterval",
			"maxEpisodeDifference"
		]
	]
};
