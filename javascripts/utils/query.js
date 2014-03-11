/**
 * @author Marcin Wieprzkowicz https://github.com/marcinwieprzkowicz/
 */


define([], function () {

	return {
		/**
		 * @description Yep, someone is asking for your mom
		 * @param  {HTMLElement} element
		 * @param  {string} selector
		 * @param  {boolean|undefined} [considerYourself]
		 * @return {HTMLElement|null} your mom
		 */
		parent: function (element, selector, considerYourself) {
			if (!considerYourself) {
				element = element.parentNode;
			}

			switch (selector[0]) {
				case ".":
					selector = selector.substr(1);
					while (element) {
						if (element.classList && element.classList.contains(selector)) {
							return element;
						} else {
							element = element.parentNode;
						}
					}
					break;
				case "#":
					selector = selector.substr(1);
					while (element && element.id !== selector) {
						element = element.parentNode;
					}
					break;
				default:
					selector = selector.toUpperCase();
					while (element && element.nodeName !== selector) {
						element = element.parentNode;
					}
			}

			return element;
		},

		/**
		 * @description Returns value of selected option in <select> HTMLElement
		 * @param  {HTMLElement} element
		 * @return {string}
		 */
		getSelected: function (element) {
			var selectedIndex;

			if (element.nodeName === "SELECT") {
				selectedIndex = element.selectedIndex;
				return element.options[selectedIndex].value;
			}

			return "";
		}
	};

});
