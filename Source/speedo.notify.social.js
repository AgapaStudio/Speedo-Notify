/*
 *	speedo.notify.social.js
 *
 *	Speedo Notify v1.0
 *
 *	Speedo Notify is a lightweight jQuery plugin
 *	with powerful customization settings.
 *
 *	http://www.artflow.ro
 *	http://www.agapastudio.com
 *
 *	Copyright (c) 2013 By Artflow & Agapa Studio.All rights reserved.
 *
 *	License:
 *		http://www.agapastudio.com/licenses/speedo-notify
 */

(function ($, notify)
{
	/*
	 *	social() - Handle notify social.
	 */
	notify.fn.modules.register_module('social', function (options)
	{
		var container = this.container;
		var contentHolder = this.contentHolder;
		var options = options;
		var social_container = null;

		/*
		 *	init() - Initialize module.
		 */
		this.init = function ()
		{
			options = $.extend({social: false}, options);

			if (options.social !== false)
			{
				var social = {};
				var default_options = 
				{
					network: 'facebook',
					type: 'share',
					href: '',
					size: '',
					annotation: 'inline',
					via: '',
					related: '',
					showCount: false,
					layout: 'standard',
					action: ''
				};

				social_container = $(document.createElement('div'));

				social_container.addClass('speedo-notify-social');

				if (options.social instanceof Array)
				{
					for (var key in options.social)
					{
						social = $.extend(default_options, options.social[key]);
						
						createSocialButton(social);
					}
				}
				else
				{
					social = $.extend(default_options, options.social);
						
					createSocialButton(social);
				}

				contentHolder.prepend(social_container);
			}	
		};

		/*
		 *	createSocialButton() - Create social button.
		 */
		function createSocialButton(social)
		{
			if (social.network == 'facebook')
			{
				var width = options.width || '450';

				var action = (social.action != '') ? ' data-action="' + action + '"' : '';

				var fb_like = '<div class="fb-like" data-href="' + social.href + '" data-layout="'+ social.layout +'" data-send="true" data-width="' + width +'" data-show-faces="false"'+ action +'></div>';
				
				social_container.append(fb_like);

				// Add the facebook javascript
				(function(d, s, id)
				{
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) return;
					js = d.createElement(s); js.id = id;
					js.src = "http:///connect.facebook.net/ro_RO/all.js#xfbml=1";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
			}
			else if (social.network == 'google')
			{
				var width = options.width || '300';

				var size = (social.size != '') ? ' data-size="' + social.size + '"' : '';

				if (social.type == 'like')
				{
					var google_plus_like = '<div class="g-plusone" '+ size +'data-annotation="'+ social.annotation +'" data-width="' + width +'"></div>';
				}
				else if (social.type == 'share')
				{
					var google_plus_like = '<div class="g-plus" data-action="share" data-width="' + width +'" data-href="' + social.href + '"></div>';
				}

				social_container.append(google_plus_like);

				$('head').append('<link rel="canonical" href="' + social.href + '" />');

				(function() {
				var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
				po.src = 'https://apis.google.com/js/plusone.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
				})();
			}
			else if (social.network == 'twitter')
			{
				var width = options.width || '300';
				var size = (social.size != '') ? ' data-size="' + social.size + '"' : '';

				if (social.type == 'share')
				{
					var twitter_share = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + social.href + '" data-via="' + social.via + '"'+ size +' data-related="' + social.related + '">Tweet</a>';
				}
				else if (social.type == 'follow')
				{
					var twitter_share = '<a href="https://twitter.com/' + social.via + '" class="twitter-follow-button" data-show-count="'+ social.showCount +'" data-url="' + social.href + '" data-via="' + social.via + '"'+ size +'>Follow @' + social.via + '</a>';
				}
				else if (social.type == 'mention')
				{
					var twitter_share = '<a href="https://twitter.com/intent/tweet?screen_name=' + social.via + '" class="twitter-mention-button" data-show-count="'+ social.showCount +'" data-url="' + social.href + '" data-via="' + social.via + '"'+ size +' data-related="' + social.related + '">Tweet @' + social.via + '</a>';
				}

				social_container.append(twitter_share);

				!function (d, s, id)
				{
					var js, fjs = d.getElementsByTagName(s)[0],	p = /^http:/.test(d.location) ? 'http' : 'https';

					if (!d.getElementById(id))
					{
						js = d.createElement(s);
						js.id = id;
						js.src = p + '://platform.twitter.com/widgets.js';
						fjs.parentNode.insertBefore(js, fjs);
					}
				}(document, 'script', 'twitter-wjs');
			}
		}

		return this;
	});

})(jQuery, speedo().notify);