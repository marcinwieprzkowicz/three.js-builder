/**
 * @author Marcin Wieprzkowicz https://github.com/marcinwieprzkowicz/
 */


define([
	"utils/query"
], function (
	query
) {

	return {
		/**
		 * @param  {HTMLElement} element
		 * @param  {string} types
		 * @param  {utils/event~onHandler} handler
		 */
		on: function (element, types, handler) {
			types = types.split(" ");

			types.forEach(function (type) {
				element.addEventListener(type, function (evt) {
					handler.call(this, evt);
				}, false);
			});
		},

		/**
		 * @param  {HTMLELement} element
		 * @param  {string} selector
		 * @param  {string} types
		 * @param  {utils/event~delegationHandler} handler
		 */
		delegation: function (element, selector, types, handler) {
			this.on(element, types, function (evt) {
				var target = query.parent(evt.target, selector, true);

				if (target) {
					handler.call(this, evt, target);
				}
			});
		},

		/**
		 * @param  {Object} evt
		 */
		preventDefault: function (evt) {
			if (evt && evt.preventDefault) {
				evt.preventDefault();
			}
		},

		/**
		 * @param  {Object} evt
		 */
		stopPropagation: function (evt) {
			if (evt && evt.stopPropagation) {
				evt.stopPropagation();
			}
		},

		/**
		 * @param  {Object} evt
		 */
		stop: function (evt) {
			this.preventDefault(evt);
			this.stopPropagation(evt);
		}
	};

	/**
	 * @description This callback is displayed as part of the utils/event object.
	 * @callback utils/event~onHandler
	 * @param  {Object} evt
	 */

	/**
	 * @description This callback is displayed as part of the utils/event object.
	 * @callback utils/event~delegationHandler
	 * @param  {Object} evt
	 * @param  {HTMLElement} target
	 */

});
