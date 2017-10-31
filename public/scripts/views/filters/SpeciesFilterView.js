var RangeCompTmpl = require('draw-hunts/RangeCompTmpl.tmpl');
var RangeItemTmpl = require('draw-hunts/RangeItemTmpl.tmpl');
var FilterModel = require('models/FilterModel');

var SpeciesRangeItemView = Backbone.Marionette.ItemView.extend({
	template:RangeItemTmpl,
	tagName:"option",
	

	initialize: function(options){
		this.options = options
	}
});

module.exports = Backbone.Marionette.CompositeView.extend({
	template:RangeCompTmpl,

	childView:SpeciesRangeItemView,
	tagName: "select",

	events:{
		"change": "getSpecies"
	},

	onShow: function(){
		var that = this;
		log.debug("comp twice")
			
		
		
		var select = this.$el.select();
		
		select.select2({
			//data: this.collection,
			dropdownAutoWidth : true,
    		width: 'auto',
			placeholder:"Select Species",
					
			minimumResultsForSearch: 99,
		})


	},

	getSpecies: function(){
		 var model = this.collection.at($(':selected', this.$el).index()).attributes;
		 log.debug("species model %o: ", model.label)
		 if(!(FilterModel.has("species"))){
			FilterModel.set("species",[])
		 }
		 if((FilterModel.has("species"))){
				FilterModel.unset("species",[])
				FilterModel.set("species", []);
		 } 


		 FilterModel.get("species").push(model.label);
		 log.debug("filter model %o ", FilterModel)
		 this.trigger("hunt:filter", model);
	},

	initialize:function(options){
		var that = this;
		this.options = options
		log.debug("model %o ",this.options.model.models)
		log.debug("this options %o ", this.options)
		this.collection = new Backbone.Collection(this.options.model.models);
		this.collection.unshift({label:"",value:"-1"});

		


		//log.debug("trying to get species % ", this.options)
		
	}

})