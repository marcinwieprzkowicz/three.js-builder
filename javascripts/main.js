/**
 * @author Marcin Wieprzkowicz https://github.com/marcinwieprzkowicz/
 */


requirejs.config({
	baseUrl: "/",
	paths: {
		"text": "javascripts/bower/requirejs-text/text",
		"JSZip": "javascripts/bower/jszip/dist/jszip",
		"utils": "javascripts/utils",
		"amd": "javascripts/amd"
	}
});


require([
	"amd/Builder"
], function (
	Builder
) {
	new Builder({
		modulesFolder: "threejs-src",
		versionNode: document.querySelector("#version"),
		placeAt: document.querySelector("#content .mCont")
	});
});
