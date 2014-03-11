/**
 * @author Marcin Wieprzkowicz https://github.com/marcinwieprzkowicz/
 */


define([], function () {

	return {
		/**
		 * @description Based on dojo/dom-prop:get
		 * @param  {Array.<string>} parts
		 * @param  {boolear} create
		 * @param  {Object} context
		 * @return {Object}
		 */
		getProp: function (parts, create, context) {
			var p, i = 0;

			while (context && (p = parts[i++])) {
				if (p in context) {
					context = context[p];
				} else if (create) {
					context = context[p] = {};
				} else {
					context = undefined;
				}
			}
			return context;
		},

		/**
		 * @description Based on dojo/base/lang:getObject
		 * @param  {string} path
		 * @param  {boolean} create
		 * @param  {Object} context
		 * @return {Object}
		 */
		getObject: function (path, create, context) {
			return this.getProp(path.split("/"), create, context);
		},

		/**
		 * @description Based on dojo/base/lang:setObject
		 * @param  {string} path
		 * @param  {*} value
		 * @param  {Object} context
		 * @return {Object}
		 */
		setObject: function (path, value, context) {
			var parts = path.split("/"),
				p = parts.pop(),
				obj = this.getProp(parts, true, context);

			return obj && p ? (obj[p] = value) : undefined;
		},

		/**
		 * @description http://javascript.crockford.com/remedial.html
		 * @param  {*} value
		 * @return {string}
		 */
		typeOf: function (value) {
			var s = typeof value;
			if (s === "object") {
				if (value) {
					if (value instanceof Array) {
						s = "array";
					}
				} else {
					s = "null";
				}
			}
			return s;
		},

		/**
		 * @description Loops through an object's properties
		 * @param  {Object} obj
		 * @param  {utils/object~forEachCallback} callback
		 * @param  {Object} [scope]
		 */
		forEach: function (obj, callback, scope) {
			var key;

			if (typeof scope === "undefined") {
				scope = this;
			}

			for(key in obj) {
				if (obj.hasOwnProperty(key)) {
					callback.call(scope, key, obj[key]);
				}
			}
		}
	};

	/**
	 * @description This callback is displayed as part of the utils/object object.
	 * @callback utils/object~forEachCallback
	 * @param  {string} key
	 * @param  {*} value
	 */

});