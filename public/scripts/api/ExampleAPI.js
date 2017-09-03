//ExampleAPI
module.exports = {
	filters: function() {
		return "/api/example/filters";
	},
	artists: function() {
		return "/api/example/artists";
	},
	artist: function(id) {
		return Mustache.render("/api/example/artist/{{id}}", {
			id: id
		});
	}
}