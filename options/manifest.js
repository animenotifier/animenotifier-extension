// SAMPLE
this.manifest = {
	"name": "Anime Release Notifier settings",
	"icon": "/icons/icon-256.png",
	"settings": [
		{
			"tab": i18n.get("Basic"),
			"group": "Account",
			"name": "arnUserName",
			"id": "arnUserName",
			"type": "text",
			"label": "Username:",
			"text": "Your username on notify.moe"
		},
		{
			"tab": i18n.get("Basic"),
			"group": "URL",
			"name": "previewURL",
			"type": "description",
			"text": ""
		},
		/*{
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
		},*/
		{
			"tab": i18n.get("Notifications"),
			"group": "Notifier",
			"name": "notifierDescription",
			"type": "description",
			"text": "Since 25 January 2016 the outdated notification system is disabled. If you'd like to receive notifications please go to your <a href='https://notify.moe/settings' target='_blank'>settings</a> and activate the new push notifications."
		},
		/*{
			"tab": i18n.get("Donations"),
			"group": "PayPal",
			"name": "donate",
			"type": "description",
			"text": "<a href='https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WVTG44E8KWFEL' target='_blank'><img src='https://notify.moe/images/elements/donate-paypal.png' alt='Donate'/></a>"
		},
		{
			"tab": i18n.get("Donations"),
			"group": "Top donators",
			"name": "donatorList",
			"type": "description",
			"text": "<a href='https://notify.moe/donate' target='_blank'>Full list of all the awesome people helping finance this</a>"
		},*/
		/*{
			"tab": i18n.get("Feedback"),
			"group": "Send feedback",
			"name": "feedback",
			"type": "description",
			"text": "<a href='https://notify.moe/feedback' target='_blank'>Send feedback directly to the developer</a>"
		},
		{
			"tab": i18n.get("Roadmap"),
			"group": "Roadmap",
			"name": "roadmap",
			"type": "description",
			"text": "<a href='https://notify.moe/roadmap' target='_blank'>List of planned features</a>"
		},
		{
			"tab": i18n.get("Statistics"),
			"group": "Statistics",
			"name": "statistics",
			"type": "description",
			"text": "<a href='https://notify.moe/statistics' target='_blank'>Anime lists and providers</a>"
		},*/
		{
			"tab": i18n.get("Social"),
			"group": "Facebook",
			"name": "facebook",
			"type": "description",
			"text": "<a href='https://www.facebook.com/animenotifier' target='_blank'>ARN @ Facebook</a>"
		},
		{
			"tab": i18n.get("Social"),
			"group": "Twitter",
			"name": "twitter",
			"type": "description",
			"text": "<a href='https://twitter.com/animenotifier' target='_blank'>ARN @ Twitter</a>"
		},
		{
			"tab": i18n.get("Social"),
			"group": "Google+",
			"name": "googlePlus",
			"type": "description",
			"text": "<a href='https://www.google.com/+AnimeReleaseNotifierOfficial' target='_blank'>ARN @ Google+</a>"
		},
		{
			"tab": i18n.get("Social"),
			"group": "GitHub",
			"name": "gitHub",
			"type": "description",
			"text": "<a href='https://github.com/animenotifier/notify.moe' target='_blank'>ARN @ GitHub</a>"
		}
	],
	"alignment": [
		[
			"arnUserName"
		]
	]
};
