var api = require('api/HuntsAPI');

var routes = require('routes/HuntsRoutes');

var tmpl = require('draw-hunts/DrawHuntsLayout.tmpl');
var SidebarView = require('views/draw-hunts/SidebarLayout');
var MapViewTmpl = require('draw-hunts/MapView.tmpl');
var RangeCompTmpl = require('draw-hunts/RangeCompTmpl.tmpl');
var RangeItemTmpl = require('draw-hunts/RangeItemTmpl.tmpl');
var SpeciesFiltersView = require('views/filters/SpeciesFilterView');
var UnitsFilterView = require('views/filters/UnitsFilterView');
var SummaryModalView = require('views/summary/SummaryView');
//DrawyHuntsView
module.exports = Backbone.Marionette.LayoutView.extend({
	template:tmpl,
	className: '.draw-hunts',

	regions:{
		map:"#map-container",
		sidebar_container:"#sidebar-container",
		summary_modal:"#summary-modal",
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

		
		this.showSidebar(this.options);
		this.showMap();

        

	},

	showSidebar:function(options){
		this.getRegion('sidebar_container').show(new SidebarView(options));
	},


	showMap:function(options){
		var that = this;
		log.debug("show map hehe %o ", that.options)
		var map_view = new MapView(that.options)
		that.getRegion('map').show(map_view);
		

		map_view.on('hunt:summary',function(data){
			$('#summary-modal').show();
			that.getRegion('summary_modal').show(new SummaryModalView({
				model:data
			}),{preventDestroy:true})
		})

		
	},




	initialize: function(options){
		this.options = options;

		this.model = new Backbone.Model();
	}


	}); 




var MapView = Marionette.View.extend({
	id:'map',
	template:MapViewTmpl,

	/*events:{
		'dblclick':'getSummary'
	},

	getSummary: function(){
		this.trigger('hunt:summary')
	},*/

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
	        	 transparent: true
			});
			that.options.map.addLayer(basemap)
			that.options.map.addLayer(that.options.wmsLayer)
			var lat
			var lon

			that.options.map.on('dblclick',function(e){
				log.debug("hehehs")
				lat = e.latlng.lat;
				lon = e.latlng.lng;
				
				that.getPointData();
				that.trigger('hunt:summary', that.options.summary_model);
				console.log("lat %o ", lat);
				console.log("lon %o ", lon);
				
			})

			log.debug("has it o: ", that.options.map.hasLayer(that.options.wmsLayer))
			log.debug("map options %o ",that.options)
	},

	getPointData: function(){
		var that = this;
		var url = "http://localhost:9000/pointData?lat=63.05993718178895&lon=-146.14013671875003";
		$.getJSON(url,function(data){
			log.debug("data %o ", data)
			that.options.summary_model = new Backbone.Model({
				model:data
			})
		
			console.log("hunt sum data %o ", that.options.summary_model);
		})
	},

	initialize:function(options){
		this.options=options
	}
				
})




//DrawHuntsView