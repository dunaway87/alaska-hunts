var Routing = require('routers/Routing');
var ExampleView = require('views/ExampleView');

//ExampleRouter
module.exports = Backbone.Router.extend({
	routes: {
		'example': 'example',
		'example/artist/:id': 'artist',
	},
	example: function() {
		log.debug('ExampleRouter.example');

		app.m.getRegion('main').show(new ExampleView());
	},
	artist: function(id) {
		log.debug('ExampleRouter.artist');

		// app.m.getRegion('main').show(new ArtistView());
	}
}); //router