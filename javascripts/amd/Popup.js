/**
 * @author Marcin Wieprzkowicz https://github.com/marcinwieprzkowicz/
 */


define([
	"amd/tim",
	"utils/dom",
	"utils/event",
	"text!templates/popup.html"
], function (
	tim,
	dom,
	event,
	popupTemplate
) {

	function Popup () {
		/**
		 * @description Popup dom node
		 * @type {HTMLElement}
		 */
		this.domNode = dom.create(popupTemplate, {}, document.body);

		/**
		 * @description Cached html elements of popup
		 * @type {Object}
		 */
		this.element = {
			popupWrap: this.domNode.querySelector(".popupWrap"),
			popupContent: this.domNode.querySelector(".popupContent"),
			popupClose: this.domNode.querySelector(".popupClose")
		};


		this._bindEvents();
	}

	/**
	 * @description Destroys the instance
	 */
	Popup.prototype.destroy = function () {
		this.hide();
		document.body.removeChild(this.domNode);
		this.domNode = null;
	};

	/**
	 * @description Shows popup
	 * @param  {string} innerHTML
	 * @param  {boolean|undefined} [closable]
	 */
	Popup.prototype.show = function (innerHTML, closable) {
		closable = !!closable;

		document.body.classList.add("popupVisible");

		this.element.popupClose.style.display = closable ? "block" : "none";
		this.domNode.classList.toggle("closable", closable);

		this.setContent(innerHTML);
		this.element.popupWrap.style.marginTop = -this.element.popupContent.clientHeight / 2 + "px";
	};

	/**
	 * @description Hides popup and resets the content
	 */
	Popup.prototype.hide = function () {
		document.body.classList.remove("popupVisible");
		this.setContent("");
	};

	/**
	 * @description Sets content of popup
	 * @param  {HTMLElement} content
	 */
	Popup.prototype.setContent = function (content) {
		this.element.popupContent.innerHTML = content;
	};

	/**
	 * @description Gets content of popup
	 */
	Popup.prototype.getContent = function () {
		return this.element.popupContent.innerHTML;
	};

	/**
	 * @description Binds Popup events
	 */
	Popup.prototype._bindEvents = function () {
		// binds close popup event - for close icon
		event.on(this.element.popupClose, "click", function (evt) {
			event.stop(evt);

			this.hide();
		}.bind(this));

		// bind close popup event - for popup cover
		event.on(this.domNode, "click", function (evt) {
			event.stop(evt);

			if (evt.target.classList.contains("closable")) {
				this.hide();
			}
		}.bind(this));
	};


	return Popup;

});
