var RangeCompTmpl = require('draw-hunts/RangeCompTmpl.tmpl');
var RangeItemTmpl = require('draw-hunts/RangeItemTmpl.tmpl');

var FilterModel = require('models/FilterModel');
var UnitsRangeItemView = Backbone.Marionette.ItemView.extend({
	template:RangeItemTmpl,
	tagName:"option",
	

	initialize: function(options){
		this.options = options
	}
});

module.exports = Backbone.Marionette.CompositeView.extend({
	template:RangeCompTmpl,

	childView:UnitsRangeItemView,
	tagName: "select",

	events:{
		"change": "getUnit"
	},

	onShow: function(){
		var that = this;
		log.debug("comp twice")
			
		
		
		var select = this.$el.select();
		
		select.select2({
			//data: this.collection,
			dropdownAutoWidth : true,
    		width: 'auto',
			placeholder:"Select Unit",
					
			minimumResultsForSearch: 100,
		})


	},

	getUnit: function(){
		 var model = this.collection.at($(':selected', this.$el).index()).attributes;
		 log.debug("unit model %o: ", this.collection.at($(':selected', this.$el).index()).attributes)
		 
		 if(!(FilterModel.has("unit"))){
			FilterModel.set("unit",[])
		}
		 if((FilterModel.has("unit"))){
			FilterModel.unset("unit",[])
			FilterModel.set("unit", []);
		} 
			FilterModel.get("unit").push(model.label)
		 this.trigger("hunt:filter", model);
	},

	initialize:function(options){
		var that = this;
		this.options = options
		log.debug("model %o ",this.options.model.models)
		this.collection = new Backbone.Collection(this.options.model.models);
		this.collection.unshift({label:"",value:"-1"});
		
		
	}

})