var HuntsRouter = require('routers/HuntsRouter');
var HuntsRoutes = require('routes/HuntsRoutes');
var MapView = require('views/draw-hunts/MapView.js');

(function ($) {
	Backbone.emulateJSON = true;
	Backbone.emulateHTTP = true;

	app = {
		title: 'Alaska Hunts',
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

				main: "#main",
				

			});
			

		
/*			
			
			m.getRegion('header').attachView(new HeaderView());
			m.getRegion('sidebar').attachView(new SidebarView());
*/
			m.start();

			this.m = m;

			var that = this;

			this.routers.hunts = new HuntsRouter();

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
			
			app.router = app.routers.hunts;

			app.router.navigate(HuntsRoutes.drawHunts(), true);
		}
	};

	app.init();
})(jQuery);