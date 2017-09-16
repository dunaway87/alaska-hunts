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
  childEvents: {
    
      
   
  },

	onShow: function(){
		this.showSpeciesFilter();
		log.debug("side layout")

		
	},

	showSpeciesFilter: function(){
		var that = this;
		var category = that.options.category;
		var Categories = Backbone.Collection.extend({
			model:category
		});

		var filters_view;
		var categories;
		$.getJSON(api.filters(), function(filters){
			
			log.debug("filters %o",filters)
			var filter = that.options.filter;
			var Filters = Backbone.Collection.extend({
				model:filter
			});
			var filters = new Filters(filters);
			filters.each(function(filter){
				
				categories = filter.get('range');
				log.debug("cats %o ", categories);
				var CategoryCollection = new Categories(categories);
				filter.set('range', CategoryCollection);
				log.debug("filter %o ", filter)
			})
			log.debug("sdfl;j %o ", filter)
			  filters_view = new FiltersView({
				collection:filters
			});


			 filters_view.on('childview:species:filter', function(childView,data){
			 	that.options.data = data
			 	that.trigger('layer:filter', data)
				log.debug("triggered %o ", that.options.data)
			})
			that.getRegion('species').show(filters_view);

		})
		
	},



	initialize: function(options){
		this.options = options;
		this.model = new Backbone.Model(options);
		this.options.category = Backbone.Model.extend({});
		this.options.filter = Backbone.Model.extend({});

	}
})


var RangeItemView = Backbone.Marionette.ItemView.extend({
	template:RangeItemTmpl,
	tagName:"option",
	/*triggers:{
		"change": "getSpecies"
	},
		getSpecies: function(){
		 var model = this.collection.at($(':selected', this.$el).index());
		 log.debug("item view trigger model %o: ", model)
		 this.trigger("species:filter", model);
	},*/

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
		log.debug("options yo %o: ",this.model.attributes.range.models)
		
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

var FiltersView = Backbone.Marionette.CollectionView.extend({
	id:"filters-view",
	childView:RangeCompView,

	childEvents: {
    	"species:filter": function(model){
    		
    	}
  },
	

});