var ExampleRouter = require('routers/ExampleRouter');
var ExampleRoutes = require('routes/ExampleRoutes');

(function ($) {
	Backbone.emulateJSON = true;
	Backbone.emulateHTTP = true;

	app = {
		title: 'Example Application - alaska-hunts',
		events: Backbone.Radio.channel('global'),
		routers: {},

		init: function() {
			log.enableAll();
			log.info("showing all log messages");

			app.host = window.location.hostname;

			// Create an Application
			var m = new Marionette.Application();

			// Add a region
			m.addRegions({
				header: "#header-nav",
				sidebar: "#sidebar-nav",
				main: "#main"
			});
/*
			m.getRegion('header').attachView(new HeaderView());
			m.getRegion('sidebar').attachView(new SidebarView());
*/
			m.start();

			this.m = m;

			var that = this;

			this.routers.example = new ExampleRouter();

			var history = [];
			Backbone.history.on("route", function (name, args) {

			  document.title = app.title;

			  history.push({
			    name : name,
			    args : args,
			    fragment : Backbone.history.fragment
			  });
			});
			this.history = history;

			Backbone.history.start({
				pushState: Modernizr.history
			});
			
			app.router = app.routers.example;

			app.router.navigate(ExampleRoutes.example(), true);
		}
	};

	app.init();
})(jQuery);