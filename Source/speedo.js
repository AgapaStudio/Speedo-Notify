/*
 *	speedo.js
 *
 *	Speedo Core v1.0.1
 *
 *	JS Core for the Speedo Products range.
 *
 *	http://www.artflow.ro
 *	http://www.agapastudio.com
 *
 *	Copyright (c) 2013 By Artflow & Agapa Studio.All rights reserved.
 *
 *	License:
 *		http://www.agapastudio.com/licenses/speedo
 */

if (window.speedo === undefined || speedo().version.split('.').join('') < 101)
{
	(function ($, window)
	{
		/*
		 *	speedo - Create main core.
		 */
		var speedo = function ()
		{
			return new speedo.fn.init();
		};

		speedo.fn = speedo.prototype = 
		{
			version: '1.0.1',
			constructor: speedo,
			init: function ()
			{
				return this;
			}
		};

		// Prepare for later instantiation.
		speedo.fn.init.prototype = speedo.fn;

		if (window.speedo !== undefined)
		{
			var old_instance = window.speedo.fn;

			for (var name in old_instance)
			{
				if (name !== 'browser' && name !== 'utility')
				{
					speedo.fn[name] = old_instance[name]
				}
			}
		}

		// Make speedo global.
		window.speedo = speedo;

	})(jQuery, window);

	(function ($, speedo)
	{
		/*
		 *	browser() - Handle browser detection.
		 */
		speedo.fn.browser = (function ()
		{
			var object = {};
			var browsers = ['opera', 'chrome', 'safari', 'firefox'];

			object.is_ie = (function ()
			{
				var virtual_div = document.createElement('div');
		
				virtual_div.innerHTML = '<!--[if IE]><i></i><![endif]-->';

				return (virtual_div.getElementsByTagName('i')[0] != null);
			})();

			// Add other browsers values.
			for (key in browsers)
			{
				var user_agent = navigator.userAgent;
				var matches = user_agent.match(new RegExp(browsers[key], 'i'));

				object['is_' + browsers[key]] = (matches !== null);
			}

			if (object.is_ie)
			{
				var ver = 3;
				var div = document.createElement('div');
				var all = div.getElementsByTagName('i')

				while (div.innerHTML = '<!--[if gt IE ' + (++ver) + ']><i></i><![endif]-->', all[0])
					;		// We don't want to do anything.

				object.version = new String(ver > 4 ? ver : 0);
				object.version.high = object.version;
			}
			else
			{
				var app_name = navigator.appName;
				var user_agent = navigator.userAgent;

				var matches = user_agent.match(/(opera|chrome|safari|firefox)\/?\s*(\.?\d+(\.\d+)*)/i);

				var temp;

				if (matches && (temp = user_agent.match(/version\/([\.\d]+)/i)) != null)
				{
					matches[2] = temp[1];
				}

				matches = (matches) ? matches[2] : navigator.appVersion;

				object.version = new String(matches);
				object.version.high = parseInt(object.version);
			}

			return object;
		})();

	})(jQuery, speedo);

	(function ($, speedo)
	{
		/*
		 *	speedo.utility - Utility functions.
		 */
		speedo.fn.utility = (function ()
		{
			var self = {};

			/*
			 *	set_cookie() - Create and set Cookie.
			 *
			 *	PARAMETERS:
			 *		name		- Specifies the cookie name.
			 *		value		- Specifies the cookie value.
			 *		expireDays	- Specifies the expiration date of the cookie in days.
			 */
			self.set_cookie = function (name, value, expire_days)
			{
				var date = new Date();

				date.setDate(date.getDate() + expire_days);

				var value = escape(value) + ((expire_days == null) ? '' : '; expires='+date.toUTCString());

				document.cookie = name + '=' + value;
			}

			/*
			 *	get_cookie() - Get a specific cookie by name.
			 *
			 *	PARAMETERS:
			 *		name	- The name of the cookie.
			 *
			 *	RETURN VLAUE:
			 *		If the cookie has been found, the function returns the value of the cookie.
			 *		If the cookie was not found, the function returns NULL.
			 */
			self.get_cookie = function (name)
			{
				var cookies = document.cookie.split(';');
				var cookie_name = '';
				var cookie_value = '';
				var cookie = [];

				for (var i = 0; i < cookies.length; i++)
				{
					cookie = cookies[i].split('=');

					cookie_name = cookie[0].replace(/^\s+|\s+$/g, ""); 
					cookie_value = cookie[1];

					if (cookie_name == name)
					{
						return unescape(cookie_value);
					}
				}

				return null;
			}

			/*
			 *	query_parameter() - Read query url values.
			 *
			 *	PARAMETERS:
			 *		query	- The url from wich to read the code.
			 *
			 *	RETURN VALUE:
			 *		If the function succeds the return value is the query parametes as an object with name and value,
			 *		otherwise the return value is an empty object.
			 */
			self.query_parameters = function (query)
			{
				var query = query.split("+").join(" ");

				query = query.split('?')[1];

				var params = {};
				var regex = /[?&]?([^=]+)=([^&]*)/g;
				var tokens;

				while (tokens = regex.exec(query))
				{
					params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
				}

				return params;
			};

			/*
			 *	same_domain() - Check if the urls are from the same domain.
			 *
			 *	PARAMETERS:
			 *		url_a	- First url.
			 *		url_b	- Second url.
			 *
			 *	RETURN VALUE:
			 *		If the url is from the same domain, the return value is true, otherwise is false.
			 */
			self.same_domain = function (url_a, url_b)
			{
				var match_a = url_a.match(/^(https?:\/\/)?([\da-z\.-]+)\/?/);
				var match_b = url_b.match(/^(https?:\/\/)?([\da-z\.-]+)\/?/);

				alert(match_b);

				if (match_a[3] == undefined || match_b[3] == undefined)
				{
					return false;
				}

				return (match_a[3].toLower() == match_b[3].toLower())
			};

			/*
			 *	compateVersions() - Compare 2 string versions.
			 *
			 *	PARAMETERS:
			 *		version_a	- First string version.
			 *		version_b	- Second string version.
			 *
			 *	RETURN VALUE:
			 *		If the comparasion is true the return value is true, otherwise is false.
			 */
			self.compareVersions = function (version_a, version_b, operator)
			{
				var length = 0, compare=0,
					vm={
						'dev': -6,
						'alpha': -5,
						'a': -5,
						'beta': -4,
						'b': -4,
						'RC': -3,
						'rc': -3,
						'#': -2,
						'p': 1,
						'pl': 1
					},
					prepVersion = function(v)
					{
						v = (''+v).replace(/[_\-+]/g,'.');
						v = v.replace(/([^.\d]+)/g,'.$1.').replace(/\.{2,}/g,'.');
						return (!v.length?[-8]:v.split('.'));
					},
					numVersion=function(v)
					{
						return !v?0:(isNaN(v)?vm[v]||-7:parseInt(v,10));
					};

				version_a = prepVersion(version_a);
				version_b = prepVersion(version_b);

				length = Math.max(version_a.length, version_b.length);

				for (var i = 0; i < length; i++)
				{
					if (version_a[i] == version_b[i])
					{
						continue;
					}

					version_a[i] = numVersion(version_a[i]);
					version_b[i] = numVersion(version_b[i]);

					if (version_a[i] < version_b[i])
					{
						compare=-1;
						break;
					}
					else if (version_a[i] > version_b[i])
					{
						compare=1;
						break;
					}
				}

				if (!operator)
				{
					return compare;
				}

				switch (operator)
				{
					case '>':
					case 'gt':
						return (compare > 0);
					case '>=':
					case 'ge':
						return (compare >= 0);
					case '<=':
					case 'le':
						return (compare <= 0);
					case '==':
					case '=':
					case 'eq':
						return (compare === 0);
					case '<>':
					case '!=':
					case 'ne':
						return (compare !== 0);
					case '':
					case '<':
					case 'lt':
						return (compare < 0);
					default:
						return null;
				}
			};

			return self;

		})();

	})(jQuery, speedo);
}