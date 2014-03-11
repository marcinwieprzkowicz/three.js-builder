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


buster.testCase("Popup", function (run) {
	require([
		"amd/Popup"
	], function (
		Popup
	) {
		run({
			setUp: function () {
				this.instance = new Popup();
			},

			tearDown: function () {
				this.instance.destroy();
			},

			"Sets the content of the popup": function () {
				var exampleContent = "<div><strong>example</strong> content</div>";

				this.instance.show(exampleContent);
				assert.equals(this.instance.getContent(), exampleContent,
					"The content of popup is incorrect");
			},

			"Shows the close icon": function () {
				this.instance.show("test", true);

				assert.equals(this.instance.element.popupClose.style.display, "block",
					"Close icon is not visible");
			},

			"Close the popup by clicking the close icon": function () {
				this.spy(this.instance, "hide");

				this.instance.show("test", true);
				this.instance.element.popupClose.click();

				assert.isTrue(this.instance.hide.calledOnce, "`hide` function has not been called");
			},

			"Close the popup by clicking the cover": function () {
				this.spy(this.instance, "hide");

				this.instance.show("test", true);
				this.instance.domNode.click();

				assert.isTrue(this.instance.hide.calledOnce, "`hide` function has not been called");
			}
		});
	});
});
