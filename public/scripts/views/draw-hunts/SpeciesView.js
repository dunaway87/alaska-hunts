
var speciesTmpl = require('draw-hunts/SpeciesView.tmpl');

var SpeciesView = Backbone.Marionette.ItemView.extend({
	template:speciesTmpl,
	tagName:"option",


})