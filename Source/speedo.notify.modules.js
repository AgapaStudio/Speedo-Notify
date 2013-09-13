/*
 *	speedo.notify.modules.js
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
	 *	modules - Create main core.
	 */
	var modules = function ()
	{
		return new modules.fn.init();
	};

	modules.fn = modules.prototype = 
	{
		version: '1.0.1',
		constructor: modules,
		init: function ()
		{
			var modules_list = {};

			/*
			 *	register_module() - Add a module in the execute list.
			 */
			this.register_module = function (name, callback)
			{
				modules_list[name] = callback;
			};

			/*
			 *	deregister_module() - Remove a module from the execute list.
			 */
			this.deregister_module = function (name)
			{
				modules_list[name] = null;
			};

			/*
			 *	clear() - Remove all modules from the execute list.
			 */
			this.clear = function ()
			{
				modules_list = {};
			};

			/*
			 *	execute() - Execute modules.
			 */
			this.execute = function (instance, options)
			{
				for (key in modules_list)
				{
					var module = modules_list[key];

					if ($.isFunction(module))
					{
						var module_instance = module.apply(instance, [options]);

						if (module_instance != null)
						{
							module_instance.init();
						}
					}
				}

				return null;
			};

			return this;
		}
	};

	// Prepare for later instantiation.
	modules.fn.init.prototype = modules.fn;

	// Create a new instance of the modules in the popup class.
	notify.fn.modules = modules();

})(jQuery, speedo().notify);