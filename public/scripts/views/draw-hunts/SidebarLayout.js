var api = require('api/HuntsAPI');
var tmpl = require('draw-hunts/SidebarLayout.tmpl');
var RangeCompTmpl = require('draw-hunts/RangeCompTmpl.tmpl');
var RangeItemTmpl = require('draw-hunts/RangeItemTmpl.tmpl');
var FiltersCollectionTmpl = require('draw-hunts/FiltersCollectionTmpl.tmpl');


module.exports = Backbone.Marionette.LayoutView.extend({
	template: tmpl,
	className: '.filters',

	regions:{
		species:"#species-container",
		units:"#unit-container",
	},


	onShow: function(){
		this.showSpeciesFilter();
		log.debug("side layout")

		
	},

	showSpeciesFilter: function(){
		var that = this;
	

		var filters_view;
		var categories;
		
		
	},



	initialize: function(options){
		this.options = options;
		this.model = new Backbone.Model(options);
		
	}
})


var RangeItemView = Backbone.Marionette.ItemView.extend({
	template:RangeItemTmpl,
	tagName:"option",
	

	initialize: function(options){
		this.options = options
	}
});

var RangeCompView = Backbone.Marionette.CompositeView.extend({
	template:RangeCompTmpl,

	childView:RangeItemView,
	tagName: "select",

	events:{
		"change": "getSpecies"
	},

	onShow: function(){
		var that = this;
		log.debug("comp twice")
		log.debug("options yo %o: ",this.collection)
		
		var select = this.$el.select();
		
		select.select2({
			data: this.collection,
			dropdownAutoWidth : true,
    		width: 'auto',
			placeholder:"Select "+ this.model.attributes.label,
					
			minimumResultsForSearch: 99,
		})


	},

	getSpecies: function(){
		 var model = this.collection.at($(':selected', this.$el).index()).attributes;
		 log.debug("species model %o: ", this.collection.at($(':selected', this.$el).index()).attributes)
		 this.trigger("species:filter", model);
	},

	initialize:function(){
		this.collection = this.model.get('range');
		log.debug("collection %o ",this.collection);
		
	}

});

/*var FiltersView = Backbone.Marionette.CollectionView.extend({
	id:"filters-view",
	childView:RangeCompView,
	

});*/