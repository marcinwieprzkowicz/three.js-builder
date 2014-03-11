/**
 * @author Marcin Wieprzkowicz https://github.com/marcinwieprzkowicz/
 */


define([], function () {

	return {
		/**
		 * @description Removes the element at position `index`
		 * @param  {Array} arr
		 * @param  {number} index
		 */
		removeByIndex: function (arr, index) {
			if (arr.length && index >= 0 && index < arr.length) {
				arr.splice(index, 1);
			}
		},

		/**
		 * @description Removes the `value` from the array
		 * @param  {Array} arr
		 * @param  {*} value
		 */
		removeByValue: function (arr, value) {
			var index = arr.indexOf(value);
			if (index !== -1) {
				this.removeByIndex(arr, index);
			}
		}
	};

});
