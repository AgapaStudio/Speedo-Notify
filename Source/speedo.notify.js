/*
 *	speedo.notify.js
 *
 *	Speedo Notify v1.0.1
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

(function ($, speedo)
{
	/*
	 *	notify - Create main notify core.
	 */
	var notify = function (options)
	{
		return new notify.fn.init(options);
	};

	notify.fn = notify.prototype = 
	{
		version: '1.0.1',
		constructor: notify,
		init: function (options)
		{
			"use strict";

			/* Private vaiables */
			var self = this;
	
			var left = 0;
			var top = 0;
			var width = 0;
			var height = 0;

			var position = 'top';

			var container = null;
			var closeBtn = null;
			var contentHolder = null;

			var modules = [];

			var startedCount = 0;

			var embededObject = false;
			var imageList = /\.(jpg|jpeg|gif|png|bmp|tiff)(.*)?$/i;

			/* Public variables */
			this.instance_name = 'instance_' + (Math.random() * 5233);

			this.extend = new Extend();

			this.container = null;
			this.contentHolder = null;

			/*
			 *	create() - Create the html structure of the notify.
			 */
			this.create = function ()
			{
				// Make sure the theme string is lowercase.
				options.theme = options.theme.toLowerCase();

				// Theme class.
				var theme_class = (options.theme && options.theme != 'default') ? ' speedo-theme-' + options.theme : '';

				if (options.cookie.enabled)
				{
					if (options.cookie.startCount > 0)
					{
						startedCount = speedo().utility.get_cookie(options.cookie.name);

						startedCount = (startedCount) ? startedCount : 0;

						if (startedCount >= options.cookie.startCount)
						{
							return ;
						}
						
						startedCount++;

						if (options.cookie.activateAfter == 'view')
						{
							speedo().utility.set_cookie(options.cookie.name, startedCount, options.cookie.interval);
						}
					}
				}

				$('body').addClass('speedo-notify-ready');

				container = $(document.createElement('div'));
				container.addClass('speedo-notify-container'+theme_class);

				self.container = container;

				container.hide();

				// Set additional container options.
				container.css(
				{
					'z-index': (options.container.zIndex) ? options.container.zIndex : '',
					'background': (options.container.background) ? options.container.background : '',
					'opacity': (options.container.opacity) ? options.container.opacity : ''
				});
				
				self.setPosition(options.position);

				container.appendTo('body');

				// Create the content holder.
				contentHolder = $(document.createElement((options.content.link !== false) ? 'a' : 'div'));

				if (options.content.link !== false)
				{
					contentHolder.attr('href', options.content.link);
				}
				contentHolder.css('text-align', options.content.alignment);

				contentHolder.addClass('speedo-notify-content');
				contentHolder.appendTo(container);

				self.contentHolder = contentHolder;

				self.setContent(options.content.value, getContentType());

				// Create custom buttons.
				var buttons = createButtons(options.buttons);

				if (buttons !== false)
				{
					container.append(buttons);
				}

				if (options.close)
				{
					closeBtn = $(document.createElement('a'));
			
					closeBtn.addClass('speedo-notify-close');
					closeBtn.attr('href', 'javascript: void(0);');
					closeBtn.bind('click tap', function (ev) { options.onClose(ev);	self.hideNotify(); });
					closeBtn.html((typeof(options.close) === 'string') ? options.close : '');
			
					container.append(closeBtn);
				}

				if (options.esc)
				{
					$(document).bind('keydown', onKeyDown);
				}

				// Execute all loaded modules.
				this.modules.execute(self, options);

				// On before show.
				options.onBeforeShow(container.get(0));

				self.showNotify();
			};
	
			/*
			 *	init() - dummy function for initialization.
			 */
			this.init = function ()	{ };
	
			/*
			 *	showNotify() - Show the notify.
			 */
			this.showNotify = function ()
			{
				if (embededObject)
				{
					self.setContent(options.content.value, getContentType());
				}

				// If ther is no function which extends the show, then we show the notify.
				if (!self.extend.trigger('show') || options.effectIn == null || options.effectOut == 'none')
				{
					container.show();
				}

				// Callback.
				options.onShow(container.get(0));

				if (!options.cover)
				{
					self.slidePage(options.position);
				}

				if (options.autoClose)
				{
					setTimeout(function(){ self.hideNotify();}, options.autoClose);
				}
			};
	
			/*
			 *	hideNotify() - hide the notify.
			 */
			this.hideNotify = function ()
			{
				// If ther is no function which extends the hide, then we hide the notify.
				if (!self.extend.trigger('hide') || (options.effectOut == null || options.effectOut == 'none') && (options.css3Effects == false || options.css3Effects == 'none'))
				{
					container.hide();

					// We need to remove the flash beacuse we don't want to have the movie/music playing in background.
					self.remove_embeded_object();

					if (options.closeMode === 'unload')
					{
						container.remove();
					}
				}

				if (!options.cover)
				{
					self.slidePage(true);
				}

				if (options.cookie.activateAfter == 'close')
				{
					speedo().utility.set_cookie(options.cookie.name, startedCount, options.cookie.interval);
				}
		
				// On Hide.
				options.onHide(container.get(0));
			};

			/*
			 *	toggleNotify() - Toggle notify.
			 */
			this.toggleNotify = function ()
			{
				if (self.isVisible())
				{
					self.hideNotify();
				}
				else
				{
					self.showNotify();
				}
			};

			/*
			 *	setPosition() - Set notify position.
			 *
			 *	PARAMETERS:
			 *		position	- The position to set, values: 'top', 'right', 'bottom', 'left'.
			 */
			this.setPosition = function (pos)
			{
				var size = {};

				switch (pos)
				{
					case 'top':
						size.right = 0;
						size.height = (options.height) ? options.height : 'auto';
						size.left = 0;
						size.top = 0;
						break;

					case 'right':
						size.height = (options.width) ? options.width : '100%';
						size.right = 0;
						size.top = 0;
						size.bottom = 0;
						break

					case 'bottom':
						size.right = 0;
						size.height = (options.height) ? options.height : 'auto';
						size.left = 0;
						size.bottom = 0;
						break;

					case 'left':
						size.height = (options.width) ? options.width : '100%';
						size.left = 0;
						size.top = 0;
						size.bottom = 0;
						break
				}

				position = pos;

				container.addClass('notify-' + pos);
				container.css(size);
			};

			/*
			 *	slidePage() - Slide the webpage so we can fit our container.
			 *
			 *	PARAMETERS:
			 *		hide - The container is hiding.
			 */
			this.slidePage = function (hide)
			{
				if (options.position != 'top')
				{
					return ;
				}

				if (hide === true)
				{
					$('html').animate({'margin-top': ''}, 'slow');
					return ;
				}

				$('html').animate({'margin-top': container.height()}, 'slow');
			};
	
			/*
			 *	setContent() - Set notify content.
			 *
			 *	PARAMETERS:
			 *		content		- The contentent.
			 *		type		- The content type.
			 *		complete	- Content loading complete.
			 *
			 *	NOTE:
			 *		If the type is not specified, the function will try to determine
			 *		the type based on the provided content.
			 */
			this.setContent = function (content, type, complete)
			{
				var contentType = (type && type !== 'auto') ? type : getContentType(content);
				var complete = (complete) ? complete : function () {};

				// Clear the old content.
				contentHolder.html('');

				if (contentType == "html")
				{
					contentHolder.html(content);

					options.onComplete(container.get(0), contentType);
					complete(container.get(0), contentType);
				}
				else if (contentType == "image")
				{
					var image = new Image();

					image.src	= content;
					$(image).load(function (ev)
					{
						options.onComplete(container.get(0), contentType);
						complete(container.get(0), contentType);
					});
					contentHolder.append(image);
				}
				else if (contentType == "ajax")
				{
					// Use ajax to load the notify content.
					$.ajax({
						type: options.content.method,
						data: options.content.data,
						url: content,
						beforeSend: function ()
						{
						},
						success: function (data)
						{
							contentHolder.html(data);
							// On complete.
							options.onComplete(container.get(0), contentType);
							complete(container.get(0), contentType);
						}
					});
				}
				else if (contentType == "iframe")
				{
					var iFrameContent = $(document.createElement('iframe'));

					iFrameContent.attr('border', 0);
					iFrameContent.attr('frameBorder', 0);
					iFrameContent.attr('marginwidth', 0);
					iFrameContent.attr('marginheight', 0);
					iFrameContent.css({width: options.width, height: options.height});
					iFrameContent.get(0).src = content;
					iFrameContent.load(function ()
					{
						// On complete.
						options.onComplete(container.get(0), contentType);
						complete(container.get(0), contentType);
					});

					contentHolder.append(iFrameContent);
				}
				else if (contentType == "flash")
				{
					var flashObject = buildFlashObject(content, options.width, options.height, options.flashvars);

					contentHolder.append(flashObject);

					setTimeout(function ()
					{
						// On complete.
						options.onComplete(container.get(0), contentType);
						complete(container.get(0), contentType);
					}, 80);

					//contentHolder.append(flashObject);
				}
				else	// Unkonown content type.
				{
					contentHolder.html(content);

					options.onComplete(container.get(0), contentType);
					complete(container.get(0), contentType);
				}
			};

			/*
			 *	width() - Get or set the notify width.
			 *
			 *	PARAMETERS:
			 *		value	- The new width value.
			 *		animate	- Animate the resize. Default is true.
			 *
			 *	RETURN VALUE:
			 *		Returns the current width of the notify.
			 */
			this.width = function (value, animate)
			{
				var oldValue = width;
				var animate = (animate == undefined) ? true : animate;

				if (value)
				{
					width = value;

					if (animate)
					{
						container.animate({width: value, left: Math.floor(value / 2)}, "slow");
					}
					else
					{
						container.css('width', value);
					}
				}

				return oldValue;
			};

			/*
			 *	height() - Get or set the notify height.
			 *
			 *	PARAMETERS:
			 *		value	- The new height value.
			 *		animate	- Animate the resize. Default is true.
			 *
			 *	RETURN VALUE:
			 *		Returns the current height of the notify.
			 */
			this.height = function (value, animate)
			{
				var oldValue = height;
				var animate = (animate == undefined) ? true : animate;

				if (value)
				{
					height = value;

					if (animate)
					{
						container.animate({height: value, top: Math.floor(value / 2)}, "slow");
					}
					else
					{
						container.css('height', value);
					}
				}

				return oldValue;
			};

			/*
			 *	options() - Set/Get options.
			 *
			 *	PARAMETERS:
			 *		name	- [optional] The name of the option to change, If this is an object then it will change multiple options.
			 *		value	- [optional] The value of the option, If the name is an object this attribute is ignored.
			 *				  If this is undefined and the name is a string, the function will return the option.
			 *
			 *	RETURN VALUE:
			 *		Returns an option value or the whole array with options.
			 */
			this.options = function (name, value)
			{
				if (typeof(name) === 'string')
				{
					if (value !== undefined)
					{
						options[name] = value;
					}
					else
					{
						return options[name];
					}
				}
				else if (typeof(name) === 'object')
				{
					options = $.extend(options, name);
				}

				return options;
			};

			/*
			 *	remove_embeded_object() - Remove embeded objects.
			 */
			this.remove_embeded_object = function ()
			{
				if (embededObject)
				{
					contentHolder.html(' ');
				}
			};

			/*
			 *	get_box_size() -  Get left, top, width, height.
			 */
			this.get_box_size = function ()
			{
				return {left: left, top: top, width: width, height: height};
			};

			/*
			 *	isVisible() - Check if the notify is vissible.
			 */
			this.isVisible = function ()
			{
				return (self.container.is(':visible'));
			}

			/* Private Functions */

			/*
			 *	createButtons() - Create custom buttons.
			 *
			 *	PARAMETERS:
			 *		buttons	- An array with objects data for buttons.
			 *
			 *	RETURN VALUE:
			 *		If the function succeds, the return value is an html div object with all the buttons.
			 *		If the function fails, the return value is false.
			 */
			function createButtons(buttons)
			{
				if ($.isArray(buttons) && buttons.length > 0)
				{
					var reservedAttr = ['html', 'action'];
					var buttonsContainer = $(document.createElement('div'));

					buttonsContainer.addClass('speedo-notify-custom-buttons');

					for (var i = 0; i < buttons.length; i++)
					{
						var button = $(document.createElement('a'));

						button.attr('href', 'javascript: void(0);');
						if (buttons[i]['html'])
						{
							button.html(buttons[i]['html']);
						}

						for (var key in buttons[i])
						{
							if (reservedAttr.indexOf(key) == -1)
							{
								button.attr(key, buttons[i][key]);
							}
						}

						if ($.isFunction(buttons[i]['action']))
						{
							// Register callback.
							button.click(buttons[i]['action']);
						}

						buttonsContainer.append(button);
					}

					return buttonsContainer;
				}

				return false;
			}

			/*
			 *	getContentType() - Get the content type.
			 *
			 *	PARAMETERS:
			 *		content	- Content.
			 *
			 *	RETURN VALUE:
			 *		Returns the type of the content.
			 */
			function getContentType(content)
			{
				var content = (content) ? content : options.content.value;

				if (options.content.type !== 'auto')
				{
					return options.content.type;
				}

				// Reset the embededObject.
				embededObject = false;

				if (content == null || content == '')
				{
					return 'html';
				}

				if (content.match(imageList))	// Check if the content is an image link.
				{
					return 'image';
				}

				if (content.match(/[^\.]\.(swf)\s*$/i))	// Check if the content is a swf file.
				{
					embededObject = true;

					return 'flash';
				}

				if (content.match(/^https?:/i))
				{
					return 'iframe';
				}

				var idStart = 0;

				if ((idStart = content.indexOf('#')) === 0)
				{
					var object = $(content);

					if (object.length > 0)
					{
						options.content.value = object.html();
					}
				}

				return 'html';
			}

			/*
			 *	buildFlashObject() - Create the object tag for embeding flash file.
			 *
			 *	PARAMETERS:
			 *		href		- swf location.
			 *		width		- width of the swf.
			 *		height		- height of the swf.
			 *		flashvars	- flash vars.
			 *
			 *	RETURN VALUE:
			 *		Returns the html object.
			 */
			function buildFlashObject(href, width, height, flashvars)
			{
				var flashvars = (flashvars || flashvars == '') ? 'autostart=1&autoplay=1&fullscreenbutton=1' : flashvars;

				/*
				 *	Note: We build all the object and create it one time, for 2 reasons:
				 *		1. IE8 will not append any element to the object tag.
				 *		2. This way is faster than creating evrey element separately, but costs file size.
				 */
				var object = '<object width="'+width+'" height="'+height+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000">';

				object += '<param name="movie" value="'+href+'" />'+
						  '<param name="allowFullScreen" value="true" />'+
						  '<param name="allowscriptaccess" value="always" />'+
						  '<param name="wmode" value="transparent" />'+
						  '<param name="autostart" value="true" />'+
						  '<param name="autoplay" value="true" />'+
						  '<param name="flashvars" value="'+flashvars+'" />'+
						  '<param name="width" value="'+width+'" />'+
						  '<param name="height" value="'+height+'" />';

				object += '<embed src="'+href+'" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true"'+
									' autostart="true" autoplay="true" flashvars="'+flashvars+'" wmode="transparent" width="'+width+'"'+
									' height="'+height+'" style="margin: 0; padding: 0" />';

				object += '</object>';

				// Create and return the object.
				return $(object);
			}
	
			/*
			 *	onKeyDown() - On key down event for the whole page.
			 */
			function onKeyDown(ev)
			{
				var keyCode = ev.keyCode || ev.charCode || ev.which;
		
				if (keyCode == 27)		// Escape code.
				{
					self.hideNotify();
				}
			}

			return this;
		}
	};

	// Prepare for later instantiation.
	notify.fn.init.prototype = notify.fn;


	/*
	 *	Extend() - Class to handle the extending part of the notify.
	 *
	 *	Note:
	 *		The actions will not be asynchronus.
	 */
	function Extend()
	{
		var actions = {};

		/*
		 *	add_action() - Add an action to the stack to be executed later by the trigger function.
		 *
		 *	PARAMETERS:
		 *		name		- Action name identifier.
		 *		callback	- Function callback.
		 */
		this.add_action = function (name, callback)
		{
			if (actions[name] == undefined)
			{
				actions[name] = [];
			}

			actions[name].push(callback);
		};

		/*
		 *	remove_action() - Remove an action from the stack.
		 *
		 *	PARAMETERS:
		 *		name		- Action name identifier.
		 *		callback	- Function callback.
		 */
		this.remove_action = function (name, callback)
		{
			if (actions[name] != undefined)
			{
				for (key in actions[name])
				{
					if (actions[name][key] === callback)
					{
						actions[name] = actions[name].splice(key, 1);
					}
				}
			}
		};

		/*
		 *	trigger() - Trigger an action.
		 *
		 *	PARAMETERS:
		 *		name	- Action name identifier.
		 *		data	- Additional data to send to the action.
		 */
		this.trigger = function (name, data)
		{
			var result = false;

			if (actions[name] != undefined)
			{
				for (key in actions[name])
				{
					if ($.isFunction(actions[name][key]))
					{
						actions[name][key](data);

						result = true;
					}
				}
			}

			return result;
		};
	}

	/*
	 *	Events() - Handle notify events.
	 */
	function Events()
	{
		var self = this;
		var $ = jQuery;
	
		var jSelf = $(this);	// jQuery Self.

		/*
		 *	bind() - Bind an event to this instance of the event manager.
		 *
		 *	PARAMETERS:
		 *		event_type	- A string containing one or more event types.
		 *		event_data	- A map of data that will be passed to the event handler.
		 *		event_object	- A function to execute each time the event is triggered.
		 */
		this.bind = function (event_type, event_data, event_object)
		{
			return jSelf.bind(event_type, event_data, event_object);
		};
	
		/*
		 *	unbind() - Unbind an event from this instance of the event manager.
		 *
		 *	PARAMETERS:
		 *		event_type	- A string containing one or more event types.
		 *		event_object	- The function that is to no longer be executed.
		 */
		this.unbind = function (event_type, event_object)
		{
			return jSelf.unbind(event_type, event_object);
		};
	
		/*
		 *	trigger() - Trigger an event attached to this instance of the event manager.
		 *
		 *	PARAMETERS:
		 *		event_type	- A string containing an event type.
		 *		event_data	- Additional parameters to pass along to the event handler.
		 */
		this.trigger = function (event_type, event_data)
		{
			return jSelf.trigger(event_type, event_data);
		};
	}

	// Register event manager.
	notify.fn.events = new Events();

	// Register notify plugin.
	speedo.fn.notify = notify;


	/*
	 *	speedoNotify() - Speedo Notify plugin.
	 */
	$.fn.speedoNotify = function (options)
	{
		var defaultOptions = {
			width: null,
			height: null,
			position: 'top',
			cover: true,
			close: true,
			theme: 'default',
			content:
			{
				alignment: 'left',
				type: 'auto',
				link: false,
				value: '<p> Default content </p>',
				method: 'POST',
				data: {}
			},
			cookie:
			{
				enabled: false,
				startCount: 1,
				interval: 30,							// 30 Days default.
				name: 'speedo-notify-start-count',		// Cookie name.
				activateAfter: 'view'					// When to activate the cookie. after view or after close.
			},
			container:
			{
				zIndex: false,
				background: false,
				opacity: false
			},
			esc: false,
			closeMode: 'hide',
			autoClose: false,
			autoShow: false,
			showOnEvent: false,
			responsive: true,
			buttons: null,

			// Callbacks
			onBeforeShow: function () {},		// Before the notify is showing.
			onShow: function () {},				// When the notify is showing.
			onComplete: function () {},			// After the notify content finished loading.
			onHide: function () {},				// When the notify is hiding.
			onClose: function () {}				// When the close button was clicked.
		};
		
		var options = $.extend(true, defaultOptions, options);
		
		function runNotify()
		{
			var notifyInstance = null;

			var uniqueSpeedoInstance = this.data('unique-speedo-instance');
		
			if (!uniqueSpeedoInstance || options.closeMode === 'unload')
			{
				notifyInstance = speedo().notify(options);

				if (!speedo.fn.notifyInstances)
				{
					speedo.fn.notifyInstances =
					{
						getFromElement: function (el)
						{
							var el = (el instanceof jQuery) ? el : $(el);

							if (!el.hasClass('speedo-notify-container'))
							{
								el = el.closest('.speedo-notify-container');
							}

							var index = el.data('speedoInstance');

							return speedo.fn.notifyInstances.list[index] || null;
						},
						list: []
					};
				}

				// Assign notify instance to a global notify array.
				speedo.fn.notifyInstances.list.push(notifyInstance);
			
				// Wait until the autoShow time passes and then create and show the notify.
				if (options.autoShow)
				{
					setTimeout(function(){ notifyInstance.create(); notifyInstance.container.data('speedoInstance', speedo.fn.notifyInstances.list.length - 1); }, options.autoShow);
				}
				else
				{
					notifyInstance.create();

					// Add the instance index to the element.
					notifyInstance.container.data('speedoInstance', speedo.fn.notifyInstances.list.length - 1);
				}
			
				this.data('unique-speedo-instance', notifyInstance);
			}
			else
			{
				notifyInstance = uniqueSpeedoInstance;
			
				// Wait until the autoShow time passes and then show the notify.
				if (options.autoShow)
				{
					setTimeout(function(){ notifyInstance.showNotify(); }, options.autoShow);
				}
				else
				{
					notifyInstance.showNotify();
				}
			
			}
		
			return notifyInstance;
		}

		if (options.showOnEvent)
		{
			var selfEl = this;

			$(this).on(options.showOnEvent, function ()
			{
				runNotify.apply(selfEl);
			});

			return null;
		}

		return runNotify.apply(this);
	};

	$(function ()
	{
		speedo.fn.notifyOptions = {};

		speedo.fn.notifyOptions.list = {};

		speedo.fn.notifyOptions.register = speedo.fn.notifyOptions.update = function (name, options)
		{
			speedo.fn.notifyOptions.list[name] = options;
		};

		speedo.fn.notifyOptions.unregister = function (name)
		{
			delete speedo.fn.notifyOptions.list[name];
		};

		speedo.fn.notifyOptions.get = function (name)
		{
			if (speedo.fn.notifyOptions.list.hasOwnProperty(name))
			{
				return speedo.fn.notifyOptions.list[name];
			}

			return {};
		};

		$(document).on('click tap', '.speedo-notify', function (ev)
		{
			ev.preventDefault();

			var $cliked = $(this);
			var href	= $cliked.attr('href');
			var use		= $cliked.data('speedoUse');

			if ($cliked.hasClass('speedo-action-hide'))
			{
				var length = speedo.fn.notifyInstances.list.length;
				var index = $cliked.data('speedoInstance') || 'all';

				if (index == 'all' && length > 0)
				{
					for (var i = 0; i < length; i++)
					{
						speedo.fn.notifyInstances.list[i].hideNotify();
					}
				}
				else if (length > 0)
				{
					speedo.fn.notifyInstances.list[index].hideNotify();
				}
			}
			else if ($cliked.hasClass('speedo-action-toggle'))
			{
				var length = speedo.fn.notifyInstances.list.length;
				var index = $cliked.data('speedoInstance') || 'all';

				if (index == 'all' && length > 0)
				{
					for (var i = 0; i < length; i++)
					{
						speedo.fn.notifyInstances.list[i].toggleNotify();
					}
				}
				else if (length > 0)
				{
					speedo.fn.notifyInstances.list[index].toggleNotify();
				}
			}
			else
			{
				var options = {};

				if ($(this).data('speedoOptions') != undefined)
				{
					var speedoOptions = $cliked.data('speedoOptions');

					options = $.extend({
						effectIn: 'fade',
						effectOut: 'fade',
						content: { value: href }
					}, speedoOptions);
				}

				if (use != undefined)
				{
					options = speedo.fn.notifyOptions.get(use);
				}

				$(this).speedoNotify(options);
			}
		});

		/*
		 *	Handle speedo-notify tag.
		 */
		$('speedo-notify').each(function ()
		{
			var $this = $(this);
			var mode = $this.attr('mode') || 'link';

			switch (mode)
			{
			case 'link':
				var href = $this.attr('href') || '#';
				var classes = $this.attr('class');
				var action = 'speedo-action-' + ($this.attr('action') || 'show');
				var use = 'data-speedo-use="' + $this.attr('use') + '"';
				var speedoOptions = $this.attr('options');

				speedoOptions = (speedoOptions) ? "data-speedo-options='" + speedoOptions + "'" : '';

				$this.replaceWith('<a href="' + href + '" ' + use + ' ' + speedoOptions + ' class="speedo-notify ' + action + ' ' + classes + '">' + $this.html() + '</a>');
				break;

			case 'show':
			default:
				var speedoOptions = {};

				if ($this.attr('options') != undefined)
				{
					speedoOptions = JSON.parse($this.attr('options'));
				}

				var options = $.extend(
				{
					effectIn: 'fade',
					effectOut: 'fade'
				}, speedoOptions);

				$this.speedoNotify(options);

				$this.remove();
				break;
			}
		});
	});

})(jQuery, speedo);