var assert = buster.assert;

requirejs.config({
	baseUrl: "/",
	paths: {
		"text": "javascripts/bower/requirejs-text/text",
		"JSZip": "javascripts/bower/jszip/dist/jszip",
		"utils": "javascripts/utils",
		"amd": "javascripts/amd"
	}
});


buster.testCase("Builder", function (run) {
	require([
		"amd/Builder",
		"utils/dom",
		"utils/query",
		"utils/object",
	], function (
		Builder,
		dom,
		query,
		object
	) {
		function itemsCount(items) {
			var count = 0;

			object.forEach(items, function (key, value) {
				count += 1;
				if (object.typeOf(value) === "object") {
					count += itemsCount(value);
				}
			});

			return count;
		}

		function getLabelByFor(labels, _for) {
			return labels.filter(function (label) {
				return label.getAttribute("for") === _for;
			})[0];
		}


		run({
			setUp: function () {
				var versionNode;
				this.selectedVersion = "test";
				this.modulesFolder = "folder";
				versionNode = dom.create("<select><option value='" + this.selectedVersion + "' selected='selected'></option></select>");

				this.stub(Builder.prototype, "loadVersion");

				this.instance = new Builder({
					"modulesFolder": this.modulesFolder,
					"versionNode": versionNode,
					"placeAt": document.body
				});
			},

			tearDown: function () {
				this.instance.destroy();
			},

			"Loads the latest available version after initialization": function () {
				assert.isTrue(Builder.prototype.loadVersion.calledWith(this.selectedVersion),
					"The latest version has not been loaded");
			},

			"Renders the list": function () {
				var items,
					dependencies = {
						"cameras": {},
						"core": {}
					};

				this.instance._renderList(dependencies, this.instance.element.modulesList);
				items = this.instance.element.modulesList.querySelectorAll("li");

				assert.equals(Object.keys(dependencies).length, items.length,
					"Number of items is incorrect");
			},

			"Renders the list with sub lists": function () {
				var items, subLists,
					dependencies = {
						"cameras": {
							"Camera": [],
							"OrthographicCamera": [],
							"PerspectiveCamera": []
						},
						"core": {
							"BufferGeometry": [],
							"Clock": []
						}
					};

				this.instance._renderList(dependencies, this.instance.element.modulesList);
				items = this.instance.element.modulesList.querySelectorAll("li");
				subLists = this.instance.element.modulesList.querySelectorAll("ul");

				assert.equals(itemsCount(dependencies), items.length,
					"Number of items is incorrect");
				assert.equals(Object.keys(dependencies).length, subLists.length,
					"Number of sub lists is incorrect");
			},

			"Sets dependencies when you check the module": function () {
				var labels, camerasLabel,
					dependencies,
					dependencyClass = "." + this.instance.STATECLASS.DEPENDENCY,
					modulesData = {
						"required": [],
						"dependencies": {
							"cameras": {
								"Camera": [
									"core/Face3",
									"core/Clock"
								]
							},
							"core": {
								"Face3": [],
								"Clock": []
							}
						}
					},
					expectedData = [
						"cameras/Camera",
						"core",
						"core/Face3",
						"core/Clock"
					];

				this.instance._renderVersionModules(modulesData);
				labels = this.instance.element.modulesList.querySelectorAll("label");
				labels = [].slice.call(labels); // convert to Array

				camerasLabel = getLabelByFor(labels, "cameras");
				camerasLabel.click();

				dependencies = this.instance.element.modulesList.querySelectorAll(dependencyClass);
				dependencies = [].slice.call(dependencies);

				dependencies.forEach(function (dependency) {
					var path = dependency.querySelector("input").id;
					assert.greater(expectedData.indexOf(path), -1,
						"One or more module is not marked as dependency");
				});
			},

			"Unchecks dependencies when you uncheck the module": function () {
				var labels, camerasLabel,
					dependencies,
					dependencyClass = "." + this.instance.STATECLASS.DEPENDENCY,
					modulesData = {
						"required": [],
						"dependencies": {
							"cameras": {
								"Camera": [
									"core/Face3",
									"core/Clock"
								]
							},
							"core": {
								"Face3": [],
								"Clock": []
							}
						}
					};

				this.instance._renderVersionModules(modulesData);
				labels = this.instance.element.modulesList.querySelectorAll("label");
				labels = [].slice.call(labels); // convert to Array

				camerasLabel = getLabelByFor(labels, "cameras");
				camerasLabel.click();
				dependencies = this.instance.element.modulesList.querySelectorAll(dependencyClass);
				assert.greater(dependencies.length, 0,
					"There should be at least one dependency selected");

				camerasLabel.click();
				dependencies = this.instance.element.modulesList.querySelectorAll(dependencyClass);
				assert.equals(dependencies.length, 0,
					"One or more dependencies still remains selected");
			},

			"Gets selected modules from DOM": function () {
				var labels, camerasLabel,
					modulesData = {
						"required": [
							"Three"
						],
						"dependencies": {
							"cameras": {
								"Camera": [
									"core/Face3",
									"core/Clock"
								]
							},
							"core": {
								"Face3": [],
								"Clock": []
							}
						}
					},
					expectedData = [
						"Three.js",
						"cameras/Camera.js",
						"core/Face3.js",
						"core/Clock.js"
					];

				// adds modules folder and selected version to expected data
				expectedData = expectedData.map(function (path) {
					return this.modulesFolder + "/" + this.selectedVersion + "/" + path;
				}, this);

				this.instance._renderVersionModules(modulesData);
				labels = this.instance.element.modulesList.querySelectorAll("label");
				labels = [].slice.call(labels); // convert to Array

				camerasLabel = getLabelByFor(labels, "cameras");
				camerasLabel.click();

				assert.equals(expectedData, this.instance.getSelectedModules(),
					"Expected data are different than returned");
			}
		});
	});
});
