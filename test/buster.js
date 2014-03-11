var config = module.exports;

config["threejs-builder"] = {
	rootPath: "../",
	environment: "browser",
	sources: [
		"javascripts/static/uglifyjs.js",
		"javascripts/static/uglifyjs-minify.js",
		"javascripts/bower/requirejs/require.js"
	],
	resources: [
		"javascripts/bower/jszip/dist/jszip.js",
		"javascripts/bower/requirejs-text/text.js",
		"javascripts/utils/*.js",
		"javascripts/amd/*.js",
		"templates/*.html"
	],
	tests: [
		"test/*-test.js"
	]
};
