//ExampleAPI
module.exports = {
	filters: function() {
		return Mustache.render("/api/hunts/filters");
	},

	pointData: function(lat, lon){
		return Mustache.render("api/hunts/pointData")
	}
	
}