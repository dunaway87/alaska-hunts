var api = require('api/HuntsAPI');

var routes = require('routes/HuntsRoutes');

var tmpl = require('draw-hunts/DrawHuntsLayout.tmpl');
var SidebarView = require('views/draw-hunts/SidebarLayout');
var MapViewTmpl = require('draw-hunts/MapView.tmpl');
var RangeCompTmpl = require('draw-hunts/RangeCompTmpl.tmpl');
var RangeItemTmpl = require('draw-hunts/RangeItemTmpl.tmpl');
//DrawyHuntsView
module.exports = Backbone.Marionette.LayoutView.extend({
	template:tmpl,
	className: '.draw-hunts',

	regions:{
		map:"#map-container",
		sidebar_container:"#sidebar-container"
	},



	onShow:function(){
		require.ensure([], function() {
			require("leaflet/leaflet.css");
			require("leaflet/leaflet.js");
			require("leaflet/leaflet-src.js");
		});

		

		this.options.wmsLayer={};
		this.options.filterLayer={};
		this.options.map={};
		this.options.speciesFilter={};

		/*this.options.filterLayer = L.tileLayer.wms('http://geoblaster.info:8080/geoserver/hunts/wms',{
			 	layers:'hunts:draw_hunt',
			 	format: 'image/png',
			 	env:'element:dall sheep',
        	 	transparent: true
			});;*/
		
		
		this.showSidebar();
		this.showMap();

        

	},



	showMap:function(options){
		var that = this;
		log.debug("show map hehe %o ", that.options)
		var map_view = new MapView(that.options)
		that.getRegion('map').show(map_view);
		/*var that = this;
			that.options.map = L.map('map',{
				center:[61.15,-149.9],
				zoom:4,
				
			});
	        var mapboxID ='dunaway87.hffcoej7';
			
			var	basemap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/'+mapboxID+'/{z}/{x}/{y}.png', {
				    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
				    baselayer: true

			});
			that.options.wmsLayer = L.tileLayer.wms('http://geoblaster.info:8080/geoserver/hunts/wms',{
				 layers:'hunts:draw_hunt',
				 format: 'image/png',
				 env:'element:moose',
	        	 transparent: true
			});
			this.options.map.addLayer(basemap)
			this.options.map.addLayer(that.options.wmsLayer)*/
	},

	getFilters:function(cb){
		var that = this;
		if(this.options.filters){
			cb(this.options.filters)
		} else {
			$.getJSON(api.filters(), function(filters){
				that.options.filters = new Backbone.Collection(filters);
				that.options.filters.unshift({id:"-1",type:""});
				cb(that.options.filters)
			})
		}
	},

	showSidebar: function(options){
		var that = this;
		this.getFilters(function(filters){
			var filters_view = new FiltersView({
				collection:filters
			})
			that.getRegion('sidebar_container').show(filters_view)
			filters_view.on('species:filter',function(data){
				//that.options.map.removeLayer(that.options.wmsLayer);
				log.debug(data);
				that.options.speciesFilter=data.label;
				that.options.wmsLayer.setParams({
					env:'element:'+data.label
				})	
		 		/*var filteredLayer = L.tileLayer.wms('http://geoblaster.info:8080/geoserver/hunts/wms',{
			 	layers:'hunts:draw_hunt',
			 	format: 'image/png',
			 	env:'element:dall sheep',
        	 	transparent: true*/
			//});
				
				log.debug("map options %o ", that.options.map);
				log.debug("has it o: ", that.options.map.hasLayer(that.options.wmsLayer))
				//that.options.map.addLayer(that.options.wmsLayer) 
			})
			
		})

	},

	addFilteredLayer: function(data,options){
		
		 var that = this;
		 log.debug("filterd layer options %o ", that.options)
		 that.options.map.removeLayer(that.options.wmsLayer);
		 that.options.filterLayer = L.tileLayer.wms('http://geoblaster.info:8080/geoserver/hunts/wms',{
			 	layers:'hunts:draw_hunt',
			 	format: 'image/png',
			 	env:'element:moose',
        	 	transparent: true
			});
			log.debug('layer fil %o ', that.options);
			that.options.map.addLayer(that.options.filterLayer) 
	},

	initialize: function(options){
		this.options = options;

		this.model = new Backbone.Model();
	}


	}); 


var RangeItemView = Backbone.Marionette.ItemView.extend({
	template:RangeItemTmpl,
	tagName:"option",
	

	initialize: function(options){
		this.options = options
	}
});

var FiltersView = Backbone.Marionette.CompositeView.extend({
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
			//data: this.collection,
			dropdownAutoWidth : true,
    		width: 'auto',
			placeholder:"Select Species",
					
			minimumResultsForSearch: 99,
		})


	},

	getSpecies: function(){
		 var model = this.collection.at($(':selected', this.$el).index()).attributes;
		 log.debug("species model %o: ", this.collection.at($(':selected', this.$el).index()).attributes)
		 this.trigger("species:filter", model);
	},

	initialize:function(options){
		this.options = options;
		
	}

})

var MapView = Marionette.View.extend({
	id:'map',
	template:MapViewTmpl,

	onShow:function(){
		var that = this;
		
		that.options.map = L.map('map',{
			center:[61.15,-149.9],
			zoom:4,
				
		});
	    var mapboxID ='dunaway87.hffcoej7';
			
		var	basemap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/'+mapboxID+'/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
				    baselayer: true

			});
			that.options.wmsLayer = L.tileLayer.wms('http://geoblaster.info:8080/geoserver/hunts/wms',{
				 layers:'hunts:draw_hunt',
				 format: 'image/png',
				 env:'element:moose',
	        	 transparent: true
			});
			that.options.map.addLayer(basemap)
			that.options.map.addLayer(that.options.wmsLayer)
			log.debug("has it o: ", that.options.map.hasLayer(that.options.wmsLayer))
			log.debug("map options %o ",that.options)
	},

	initialize:function(options){
		this.options=options
	}
				
})




//DrawHuntsView