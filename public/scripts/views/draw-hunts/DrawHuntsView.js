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
			var summary_modal_view = new SummaryModalView({
				model:data
			})
			that.getRegion('summary_modal').show(summary_modal_view,{preventDestroy:true})
			summary_modal_view.on("shuttle:close", function(){
				console.log("closer")
				that.getRegion('summary_modal').empty({preventDestroy:true})
				$('#summary-modal').css("display","none");
			})
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
				that.options.point_model=new Backbone.Model({
					lat:lat,
					lon:lon
				})
				
				that.trigger('hunt:summary', that.options.point_model);
				console.log("lat %o ", lat);
				console.log("lon %o ", lon);
				
			})

			log.debug("has it o: ", that.options.map.hasLayer(that.options.wmsLayer))
			log.debug("map options %o ",that.options)
	},

	

	initialize:function(options){
		this.options=options
	}
				
})




//DrawHuntsView