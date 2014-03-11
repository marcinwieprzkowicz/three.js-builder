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


buster.testCase("Preloader", function (run) {
	require([
		"amd/Preloader"
	], function (
		Preloader
	) {
		run({
			setUp: function () {
				this.instance = new Preloader();
			},

			"Calls error callback if module does not exists": function (done) {
				this.instance
				.error(done(function () {
					assert(true);
				}))
				.complete(done(function () {
					assert.isTrue(false, "Error callback has not been called");
				}))
				.load([
					"foo/bar.js"
				]);
			},

			"Calls complete callback": function (done) {
				this.instance
				.error(done(function () {
					assert.isTrue(false, "Complete callback has not been called");
				}))
				.complete(done(function () {
					assert(true);
				}))
				.load([
					"utils/event.js"
				]);
			},

			"Calls progress callback": function (done) {
				this.instance
				.error(done(function () {
					assert.isTrue(false, "Complete callback has not been called");
				}))
				.progress(done(function () {
					assert(true);
				}))
				.load([
					"utils/event.js"
				]);
			}
		});
	});
});
