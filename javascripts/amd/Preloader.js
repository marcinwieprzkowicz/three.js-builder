/**
 * @author Marcin Wieprzkowicz https://github.com/marcinwieprzkowicz/
 */


define([], function () {

	function Preloader () {
		/**
		 * @description Default callbacks
		 * @type {Object}
		 */
		this._callbacks = {
			onProgress: function () {},
			onComplete: function () {},
			onError: function () {}
		};

		/**
		 * @description Number of files to load
		 * @type {number}
		 */
		this._numberOfFiles = 0;

		/**
		 * @description Number of files already loaded
		 * @type {number}
		 */
		this._numberOfLoadedFiles = 0;
	}

	/**
	 * @description Loads required modules
	 * @param  {Array.<string>} modules
	 */
	Preloader.prototype.load = function (modules) {
		this._numberOfFiles = modules.length;

		modules.forEach(function (module, index) {
			require(["text!" + module], function (source) {
				var percent;

				this._numberOfLoadedFiles += 1;
				percent = parseInt(this._numberOfLoadedFiles / this._numberOfFiles * 100, 10);
				this._callbacks.onProgress.call(this, source, percent, index);

				if (this._numberOfLoadedFiles === this._numberOfFiles) {
					this._callbacks.onComplete.call(this);
				}
			}.bind(this), function (errObject) {
				this._callbacks.onError.call(this, errObject);
			}.bind(this));
		}, this);

		return this;
	};

	/**
	 * @description Sets onProgress callback
	 * @type  {Preloader~progressCallback} callback
	 */
	Preloader.prototype.progress = function (callback) {
		this._callbacks.onProgress = callback;
		return this;
	};

	/**
	 * @description Sets onError callback
	 * @param  {Preloader~errorCallback} callback
	 */
	Preloader.prototype.error = function (callback) {
		this._callbacks.onError = callback;
		return this;
	};

	/**
	 * @description Sets onComplete callback
	 * @type  {Preloader~completeCallback} callback
	 */
	Preloader.prototype.complete = function (callback) {
		this._callbacks.onComplete = callback;
		return this;
	};


	/**
	 * @description This callback is displayed as part of the Preloader object.
	 * @callback Preloader~progressCallback
	 * @param  {string} source
	 * @param  {number} percent
	 * @param  {number} index
	 */

	/**
	 * @description This callback is displayed as part of the Preloader object.
	 * @callback Preloader~errorCallback
	 * @param  {Object} errObject
	 */

	/**
	 * @description This callback is displayed as part of the Preloader object.
	 * @callback Preloader~completeCallback
	 */

	return Preloader;

});
