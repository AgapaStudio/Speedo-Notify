/*
 *	speedo.notify.audio.js
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

(function ($, notify, speedo, window)
{
	/*
	 *	audio() - Smart skin engine.
	 */
	notify.fn.modules.register_module('audio', function (options)
	{
		var $window = $(window);
		var container = this.container;
		var overlay = this.overlay;
		var self = this;
		var options = options;

		this.audio_element = null;

		/*
		 *	init() - Initialize module.
		 */
		this.init = function ()
		{
			options = $.extend(options,
			{
				autoplayAudio: true,
				loop: false,
				mp3Path: undefined,
				oggPath: undefined,
				volume: 1,
				onAudioStart: function () {},
				onAudioStop: function () {}
			});


			if (options.mp3Path != undefined || options.oggPath != undefined)
			{
				self.extend.add_action('show', on_show);
				self.extend.add_action('hide', on_hide);
			}
		};

		/*
		 *	load_audio() - Load HTML5 audio files.
		 *
		 *	PARAMETERS:
		 *		mp3Path	- Path to the mp3 file.
		 *		oggPath - Path to the ogg file.
		 *		on_load - On audio loaded.
		 */
		this.load_audio = function (mp3Path, oggPath)
		{
			var audio_element = $(document.createElement('audio'));

			if (options.autoplayAudio)
			{
				audio_element.attr('autoplay', 'autoplay');
			}

			if (options.loop)
			{
				audio_element.attr('loop', 'loop');
			}

			audio_element.get(0).volume = 0;//options.volume;

			audio_element.bind('play', function (ev)
			{
				options.onAudioStart(ev);

				self.audio_element.stop().animate({volume: options.volume}, 2000);
			});

			audio_element.bind('stop pause ended', options.onAudioStop);

			var source_element = $(document.createElement('source'));

			source_element.attr('src', oggPath).attr('type', 'audio/ogg');
			audio_element.append(source_element);

			source_element = $(document.createElement('source'));

			source_element.attr('src', mp3Path).attr('type', 'audio/mpeg');
			audio_element.append(source_element);

			$('body').append(audio_element);

			self.audio_element = audio_element;
		};

		/*
		 *	play_audio() - Play the audio.
		 */
		this.play_audio = function ()
		{
			if (self.audio_element != null)
			{
				self.audio_element.get(0).play();
			}
		};

		/*
		 *	stop_audio() - Stop the audio.
		 */
		this.stop_audio = function ()
		{
			if (self.audio_element != null)
			{
				self.audio_element.get(0).pause();
			}
		};

		/*
		 *	get_audio_element() - Get the audio element.
		 */
		this.get_audio_element = function ()
		{
			return this.audio_element;
		};

		/*
		 *	on_show() - Called when the notify shows.
		 */
		function on_show()
		{
			self.load_audio(options.mp3Path, options.oggPath);
		}

		/*
		 *	on_hide() - Called when the notify shows.
		 */
		function on_hide()
		{
			self.audio_element.stop().animate({volume: 0}, 'slow', function ()
			{
				self.audio_element.remove();
			})
		}

		return self;
	});

})(jQuery, speedo().notify, speedo, window);