var tmpl = require('draw-hunts/SpeciesComposite.tmpl');

var SpeciesView = require('views/draw-hunts/SpeciesView');

module.exports = Backbone.Marionette.CompositeView.extend({
	
	template:tmpl,

	childView:SpeciesView,
	tagName: "select",

	events:{
		"change": "onSpeciesChange"
	},

	onShow: function(){
		var that = this;
		log.debug("comp twice")
		log.debug("options yo %o: ",this.collection)
		
		var select = this.$el.select();
		select.select2({
			dropdownAutoWidth : true,
    		width: 'auto',
			placeholder:"Select Species",
					
			minimumResultsForSearch: 5,
		})


	},

	onSpeciesChange: function(){
		 var model = this.collection.at($(':selected', this.$el).index());

		 log.debug("species model %o: ", model)
		 this.trigger("species:filter", model);
	},

	initialize:function(options){
		this.option = options
		
		
	}

})



