/**
 * @author Marcin Wieprzkowicz https://github.com/marcinwieprzkowicz/
 */


define([
	"amd/tim"
], function (
	tim
) {

	return {
		/**
		 * @description Creates dom node
		 * @param  {string} template
		 * @param  {Object} params
		 * @param  {HTMLElement} appendTo
		 * @return {HTMLElement}
		 */
		create: function (template, params, appendTo) {
			var node = document.createElement("div");
			node.innerHTML = tim(template, params);
			node = node.firstElementChild;

			if (typeof appendTo !== "undefined") {
				appendTo.appendChild(node);
			}

			return node;
		}
	};

});
