/*
 *	speedo.notify.effects.js
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

(function ($, notify, speedo)
{
	/*
	 *	effects() - Handle notify drag.
	 */
	notify.fn.modules.register_module('effects', function (options)
	{
		var $window = $(window);
		var container = this.container;
		var self = this;

		var left = 0;
		var top = 0;
		var width = 0;
		var height = 0;


		this.handleEffects = handleEffects;

		/*
		 *	init() - Initialize module.
		 */
		this.init = function ()
		{
			options = $.extend(
			{
				effectIn: 'fade',
				effectOut: 'fade',
				css3Effects: false
			}, options);

			// Set CSS3 effects to a random effect.
			if (options.css3Effects == "random")
			{
				var randomEffects = ["none", "slideTop", "slideBottom", "slideLeft", "slideRight",
									 "zoomOut", "flipInHor", "flipInVer", "bounceIn", "pageTop",
									 "fadeInScale", "pulse", "leftSpeedIn", "rollIn", "rollOut"];

				options.css3Effects = randomEffects[Math.floor(Math.random() * (randomEffects.length - 1))];
			}
			else if (options.css3Effects == "auto")
			{
				var effect = 'slide' +  options.position.charAt(0).toUpperCase() + options.position.substr(1);

				options.css3Effects = effect;
			}

			if (options.css3Effects && options.css3Effects != "none")
			{
				container.addClass("speedo-effect-"+options.css3Effects.toLowerCase());
			}

			// Extend the show and hide functionality so we can add effects to show and hide.
			self.extend.add_action('show', on_show);
			self.extend.add_action('hide', on_hide);
		};

		/*
		 *	animateNotify() - Animate the notify for showing or hiding.
		 *
		 *	PARAMETERS:
		 *		effect		- Specify the effect to use. You can use one of the following:
		 *						'fade'			- Fade in/out effect.
		 *						'slideLeft'		- Slide left effect.
		 *						'slideRight'	- Slide right effect.
		 *		speed		- Specify the effect speed.
		 *		show		- Specify if the animation is for showing the notify or hidding the notify.
		 *		callback	- Speicfy a callback to be called when the animation finished.
		 */
		this.animateNotify = function (effect, speed, show, callback)
		{
			var callback = ($.isFunction(callback)) ? callback : function () {};
			//var effect = effect + ((show) ? 'In' : 'Out');

			if (show)
			{
				container.hide();
			}

			switch (effect)
			{
			case 'slideLeft':
					if (show)
					{
						var width = container.width();
						container.css('left', -width);
						container.stop().animate({left: left, opacity: 'toggle'}, speed, callback);
					}
					else
					{
						var width = container.width();
						container.stop().animate({left: -width, opacity: 'toggle'}, speed, callback);
					}
				break;

			case 'slideRight':
					if (show)
					{
						container.css('left', $(window).width() + width);
						container.stop().animate({left: left, opacity: 'toggle'}, speed, callback);
					}
					else
					{
						container.stop().animate({left: $(window).width() + width, opacity: 'toggle'}, speed, callback);
					}
				break;

			case 'slideTop':
					if (show)
					{
						height = container.height();
						container.css('top', -height);
						container.stop().animate({top: top, opacity: 'toggle'}, speed, callback);
					}
					else
					{
						height = container.height();
						//container.css('top', top);
						container.stop().animate({top: -height, opacity: 'toggle'}, speed, callback);
					}
				break;

			case 'slideBottom':
					if (show)
					{
						container.css('top', $(window).height() + height);
						container.stop().animate({top: top, opacity: 'toggle'}, speed, callback);
					}
					else
					{
						container.stop().animate({top: $(window).height() + height, opacity: 'toggle'}, speed, callback);
					}
				break;

			case 'slideZoom':
					if (show)
					{
						container.css('top', -height);
						container.css('left', left + (width / 2));

						container.stop().animate({width: 'toggle',  left: left, top: top, opacity: 'toggle'}, speed, callback);
					}
					else
					{
						container.stop().animate({top: -height,  left: left + (width / 2), width: 'toggle', opacity: 'toggle'}, speed, callback);
					}
				break;

			case 'growBox':
					container.stop().animate({width: 'toggle', height: 'toggle'}, callback);
				break;

			case 'fade':
			default:
				var funcEff = (show) ? 'fadeIn' : 'fadeOut';

				container.stop();

				container[funcEff](speed, callback);
				break;
			}
		};

		/* Private functions */

		/*
		 *	handleEffects() - Handle in/out effects.
		 *
		 *	PARAMETERS:
		 *		effect			- Effect to use.
		 *		css3Effect		- CSS3 effect.
		 *		show			- Specify if the effect is for show or for hide.
		 *		contentChange	- Specify if the effect is for content change.
		 *		callback		- Called when the animation finished.
		 *
		 *	RETURN VALUE:
		 *		If the function succeds, the return value is true, otherwise is false.
		 */
		function handleEffects(effect, css3Effect, show, contentChange, callback)
		{
			if (css3Effect && css3Effect != 'none' && (!speedo().browser.is_ie || speedo().browser.is_ie > 9))
			{
				var animationEnd = function (ev)
				{
					if ($.isFunction(callback))
					{
						callback();
					}
					// We want to unbind this event after it has been executed so we don't brake something.
					container.unbind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', animationEnd);
				};

				container.bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', animationEnd);

				if (show)
				{
					container.show();

					$('body').addClass("speedo-effect-"+ css3Effect.toLowerCase() +"-active");
					container.removeClass("speedo-effect-"+ css3Effect.toLowerCase() +"-reverse")
							 .addClass("speedo-effect-"+ css3Effect.toLowerCase() +"-normal");
				}
				else
				{
					$('body').removeClass("speedo-effect-"+ css3Effect.toLowerCase() +"-active");
					container.addClass("speedo-effect-"+ css3Effect.toLowerCase() +"-reverse")
							 .removeClass("speedo-effect-"+ css3Effect.toLowerCase() +"-normal");
				}

				container.css({
					"-webkit-animation-play-state": "running",
					"-moz-animation-play-state": "running",
					"-o-animation-play-state": "running",
					"-ms-animation-play-state": "running",
					"animation-play-state": "running"
				});

				return true;
			}

			console.log('effect - ' + css3Effect + ' options - ' + options.css3Effects);

			if (effect && effect != 'none')
			{
				// If this is a function then we call it because we assume the user will handle the showing.
				if ($.isFunction(effect))
				{
					effect(container.get(0));
				}
				else if ($.isArray(effect))	// If this is a array we assume that it contains the effect name and the speed.
				{
					self.animateNotify(effect[0], effect[1], show, callback);
				}
				else // We assume that what remains is the effect name so we pass it to the animate function .
				{
					self.animateNotify(effect, 'slow', show, callback);
				}

				return true;
			}

			return false;
		}

		/*
		 *	on_show() - Called when the notify shows.
		 */
		function on_show(ev)
		{
			var size = self.get_box_size();

			left = size.left;
			top = size.top;
			width = size.width;
			height = size.height;

			if (!handleEffects(options.effectIn, options.css3Effects, true))
			{
				container.show();
			}
		}

		/*
		 *	on_hide() - called when the notify hides.
		 */
		function on_hide(ev)
		{
			var size = self.get_box_size();

			left = size.left;
			top = size.top;
			width = size.width;
			height = size.height;

			var effects = handleEffects(options.effectOut, options.css3Effects, false, false, function ()
			{
				// We need to remove the flash beacuse we don't want to have the movie/music playing in background.
				self.remove_embeded_object();

				container.hide();

				if (options.closeMode == 'unload')
				{
					container.remove();
				}
			});
		}

		return self;
	});

})(jQuery, speedo().notify, speedo);