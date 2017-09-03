//ExampleRoutes
module.exports = {
	example: function() {
		return "example";
	},
	artist: function(id) {
		return Mustache.render("example/artist/{{id}}", {
			id: id
		});
	}
}