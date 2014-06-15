/**
 * @author Marcin Wieprzkowicz https://github.com/marcinwieprzkowicz/
 */


define([
	"JSZip",
	"utils/dom",
	"utils/query",
	"utils/array",
	"utils/event",
	"utils/object",
	"amd/tim",
	"amd/Preloader",
	"amd/Popup",
	"text!templates/builder.html",
	"text!templates/listItem.html",
	"text!templates/progressBar.html",
	"text!templates/errorMessage.html"
], function (
	JSZip,
	dom,
	query,
	array,
	event,
	object,
	tim,
	Preloader,
	Popup,
	builderTemplate,
	listItemTemplate,
	progressBarTemplate,
	errorMessageTemplate
) {

	/**
	 * @param {{
	 *   modulesFolder: {string}
	 *   version: {HTMLElement}
	 *   placeAt: {HTMLElement}
	 * }} options
	 */
	function Builder (options) {
		/**
		 * @description Depenedencies object
		 * @type {Object}
		 */
		this._dependencies = {};

		/**
		 * @description Every dependency contains: domNode, refCounter and state
		 * @type {Object}
		 */
		this._dependenciesMap = {};

		/**
		 * @description Contains required modules of selected version
		 * @type {Array.<string>}
		 */
		this._required = [];

		/**
		 * @description Flag that indicates whether an error occurred
		 * @type {boolean}
		 */
		this._errorOccured = false;

		/**
		 * @description Path to threejs sources folder
		 * @type {string}
		 */
		this._modulesFolder = options.modulesFolder;

		/**
		 * @description Preloader instance
		 * @type {Preloader}
		 */
		this._loader = new Preloader();

		/**
		 * @description Popup instance
		 * @type {Popup}
		 */
		this.infoPopup = new Popup();

		/**
		 * @description Builder dom node
		 * @type {HTMLElement}
		 */
		this.domNode = dom.create(builderTemplate, {}, options.placeAt);

		/**
		 * @description Cached html elements
		 * @type {Object.<HTMLElement>}
		 */
		this.element = {
			versionNode: options.versionNode,
			modulesList: options.placeAt.querySelector("#modules-list"),
			downloadCustom: options.placeAt.querySelector("#download-custom")
		};

		/**
		 * @description Selected version of the threejs lib
		 * @type {string}
		 */
		this.selectedVersion = query.getSelected(this.element.versionNode);


		this._bindEvents();
		this.loadVersion(this.selectedVersion);
	}

	/**
	 * @description Css class names for states
	 * @type {Object.<string>}
	 * @const
	 */
	Builder.prototype.STATECLASS = {
		"REQUIRED": "checkedAsRequired",
		"DEPENDENCY": "checkedAsDependency"
	};

	/**
	 * @description Destroys the instance
	 */
	Builder.prototype.destroy = function () {
		this.infoPopup.destroy();
		this.infoPopup = null;
		this._loader = null;

		this.domNode.parentNode.removeChild(this.domNode);
		this.domNode = null;
	};

	/**
	 * @description Returns selected modules
	 * @return  {Array.<string>}
	 */
	Builder.prototype.getSelectedModules = function () {
		var requiredCopy = this._required.slice(0),
			modules = this.element.downloadCustom.querySelectorAll(".module");

		modules = [].slice.call(modules).filter(function (module) {
			return module.checked;
		}).map(function (module) {
			return this._modulesFolder + "/" + this.selectedVersion + "/" + module.value + ".js";
		}, this);

		requiredCopy = requiredCopy.map(function (module) {
			return this._modulesFolder + "/" + this.selectedVersion + "/" + module + ".js";
		}, this);

		return requiredCopy.concat(modules);
	};

	/**
	 * @description Loads modules of version
	 * @param  {string} version
	 */
	Builder.prototype.loadVersion = function (version) {
		require(["text!" + this._modulesFolder + "/" + version + "/modules.json"],
			function (modulesData) {
				this._renderVersionModules(JSON.parse(modulesData));
			}.bind(this),
			function (errObject) {
				this._showErrorMessage(errObject);
			}.bind(this)
		);
	};

	/**
	 * @description Renders modules
	 * @param  {Object} data
	 */
	Builder.prototype._renderVersionModules = function (data) {
		this._dependencies = data.dependencies;
		this._required = data.required;

		this._renderList(this._dependencies, this.element.modulesList);
	};

	/**
	 * @description Renders the list and sublists of dependencies
	 * @param  {Object} listObject
	 * @param  {HTMLElement} listNode
	 * @param  {string} [parentName]
	 */
	Builder.prototype._renderList = function (listObject, listNode, parentName) {
		if (typeof parentName === "undefined") {
			parentName = "";
		}

		object.forEach(listObject, function (itemKey, item) {
			var node,
				uniqueId = parentName.length ? parentName + "/" + itemKey : itemKey,
				isExpandable = object.typeOf(item) === "object";

			// Creates the list item and append it to the listNode
			node = dom.create(listItemTemplate, {
				"name": itemKey,
				"fieldId": uniqueId,
				"isExpandable": isExpandable,
				"isModule": !isExpandable
			}, listNode);

			// mapping the dependencies
			object.setObject(uniqueId, {
				domNode: node,
				checkbox: node.querySelector(".field input"),
				refCounter: []
			}, this._dependenciesMap);

			// creates sub list
			if (isExpandable) {
				var subList = document.createElement("ul");
				subList.classList.add("subList");
				node.appendChild(subList);

				this._renderList(item, subList, uniqueId);
			}
		}, this);
	};

	/**
	 * @description Displays popup with error messages
	 * @param  {Object} errObject
	 */
	Builder.prototype._showErrorMessage = function (errObject) {
		var popupContent = this.infoPopup.getContent(),
				errorMessage = tim(errorMessageTemplate, {
				message: errObject.message
			});

		if (popupContent.length > 0 && this._errorOccured) {
			errorMessage += popupContent;
		} else {
			this._errorOccured = true;
		}

		this.infoPopup.show(errorMessage, true);
	};

	/**
	 * @description Binds Builder events
	 */
	Builder.prototype._bindEvents = function () {
		// checks / unchecks module
		event.delegation(this.element.modulesList, "label", "click", function (evt, element) {
			var path = element.getAttribute("for"),
				mapping = object.getObject(path, false, this._dependenciesMap),
				checked = !mapping.domNode.classList.contains(this.STATECLASS.REQUIRED);

			event.stop(evt);
			this._checkDependencies(path, checked, path);
		}.bind(this));

		// expands list of modules
		event.delegation(this.element.modulesList, ".expandable", "click", function (evt, element) {
			event.stop(evt);
			query.parent(element, "li").classList.toggle("open");
		});

		// generates and download custom version of threejs
		event.on(this.element.downloadCustom, "submit", function (evt) {
			var modules = this.getSelectedModules();
			event.stop(evt);

			this._preloadModules(modules);
		}.bind(this));

		// change version
		event.on(this.element.versionNode, "change", function (evt) {
			var version = query.getSelected(evt.target);

			this._cleanList();
			this.loadVersion(version);
		}.bind(this));
	};

	/**
	 * @description Goes down through children of the path
	 * @param  {string} path
	 * @param  {boolean} checked
	 * @param  {string} requiredBy
	 */
	Builder.prototype._checkDependencies = function (path, checked, requiredBy) {
		var mapping = object.getObject(path, false, this._dependenciesMap);

		if (mapping.refCounter.indexOf(requiredBy) === -1 && checked) {
			this._checkParentDependency(path, function (parentPath, parentMapping) {
				parentMapping.refCounter.push(requiredBy);
				parentMapping.checkbox.checked = true;

				if (parentPath === requiredBy) {
					parentMapping.domNode.classList.add(this.STATECLASS.REQUIRED);
				} else {
					parentMapping.domNode.classList.add(this.STATECLASS.DEPENDENCY);
				}
			});

			this._checkChildrenDependencies(path, checked, requiredBy);
		}

		if (mapping.refCounter.indexOf(requiredBy) >= 0 && !checked) {
			this._checkParentDependency(path, function (parentPath, parentMapping) {
				array.removeByValue(parentMapping.refCounter, requiredBy);

				if (parentPath === requiredBy) {
					parentMapping.domNode.classList.remove(this.STATECLASS.REQUIRED);
				}

				if (parentMapping.refCounter.length === 0) {
					parentMapping.checkbox.checked = false;
					parentMapping.domNode.classList.remove(this.STATECLASS.DEPENDENCY);
				}
			});

			this._checkChildrenDependencies(path, checked, requiredBy);
		}
	};

	/**
	 * @description Goes up through parents of the path
	 * @param  {string} path
	 * @param  {Builder~parentDependencyCallback} callback
	 */
	Builder.prototype._checkParentDependency = function (path, callback) {
		var parentPath, parentMapping,
			parts = path.split("/");

		parts.forEach(function (part, index) {
			parentPath = index === 0 ? part : parentPath + "/" + part;
			parentMapping = object.getObject(parentPath, false, this._dependenciesMap);

			callback.call(this, parentPath, parentMapping);
		}, this);
	};

	/**
	 * @description Goes down through children of the path
	 * @param  {string} path
	 * @param  {boolean} checked
	 * @param  {string} requiredBy
	 */
	Builder.prototype._checkChildrenDependencies = function (path, checked, requiredBy) {
		var pathDependencies = object.getObject(path, false, this._dependencies);

		switch (object.typeOf(pathDependencies)) {
			case "array":
				pathDependencies.forEach(function (key) {
					this._checkDependencies(key, checked, requiredBy);
				}, this);
				break;
			case "object":
				object.forEach(pathDependencies, function (key) {
					this._checkDependencies(path + "/" + key, checked, requiredBy);
				}, this);
				break;
		}
	};

	/**
	 * @description Opens popup with progress bar template
	 * @return  {HTMLElement}
	 */
	Builder.prototype._openProgressPopup = function () {
		var progressBarContent = tim(progressBarTemplate, {
				message: "Please wait ..."
			});

		this.infoPopup.show(progressBarContent);
		return this.infoPopup.domNode.querySelector(".progressBar span");
	};

	/**
	 * @description Preloads all required modules
	 * @param  {Array.<string>} modules
	 */
	Builder.prototype._preloadModules = function (modules) {
		var progress = this._openProgressPopup(),
			loaded = new Array(modules.length);

		// loading dependencies
		this._loader.progress(function (source, percent, index) {
			progress.style.width = percent + "%";
			loaded[index] = source;
		})
		.error(function (errObject) {
			this._showErrorMessage(errObject);
		}.bind(this))
		.complete(function () {
			this._generateBuild(loaded);
		}.bind(this))
		.load(modules);
	};

	/**
	 * @description Generates custom build
	 * @param  {Array.<string>} loaded
	 */
	Builder.prototype._generateBuild = function (loaded) {
		var zip = new JSZip(),
			minified = UglifyJS.minify(loaded);

		zip.file("threejs-custom-" + this.selectedVersion + ".js", minified);
		this.infoPopup.hide();

		location.href = "data:application/zip;base64," + zip.generate();
	};

	/**
	 * @description Cleans modules list DOM node
	 */
	Builder.prototype._cleanList = function () {
		this.element.modulesList.innerHTML = "";
	};


	/**
	 * @description This callback is displayed as part of the Builder object.
	 * @callback Builder~parentDependencyCallback
	 * @param  {string} parentPath
	 * @param  {Object} parentMapping
	 */

	return Builder;

});
