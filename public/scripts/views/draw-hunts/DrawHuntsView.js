var api = require('api/HuntsAPI');

var routes = require('routes/HuntsRoutes');

var tmpl = require('draw-hunts/DrawHuntsLayout.tmpl');
var SidebarView = require('views/draw-hunts/SidebarLayout');

//DrawyHuntsView
module.exports = Backbone.Marionette.LayoutView.extend({
	template:tmpl,
	className: '.draw-hunts',

	regions:{
		map:"#map",
		sidebar_container:"#sidebar-container"
	},

	onShow:function(){
		require.ensure([], function() {
			require("leaflet/leaflet.css");
			require("leaflet/leaflet.js");
			require("leaflet/leaflet-src.js");
		});
		this.map = L.map('map',{
			center:[61.15,-149.9],
			zoom:4,
			
		});
		this.wmsLayer;
		this.addMap();
		this.showSidebar();

		this.options.data;
	},

	addMap:function(){
		var that = this;
		var mapboxID ='dunaway87.hffcoej7';
		
		var	basemap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/'+mapboxID+'/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
			    baselayer: true

		});

		 that.wmsLayer = L.tileLayer.wms('http://geoblaster.info:8080/geoserver/hunts/wms',{
			 	layers:'hunts:draw_hunt',
			 	format: 'image/png',
			 	env:'element:moose',
        	 	transparent: true
		});

		

		that.map.addLayer(basemap);
		that.map.addLayer(that.wmsLayer);
	},

	
	showSidebar: function(){
		var that = this;
		var zoom;
		var pan;
				
		var sidebar_view = new SidebarView();
		 var that = this;
		 

		
		that.getRegion('sidebar_container').show(sidebar_view);
		sidebar_view.on("layer:filter", function(data){
			that.options.data = data.label;
			that.map.removeLayer(that.wmsLayer);
			that.addFilteredLayer(data)
			log.debug('layer fil %o ', data.label);
		})

	},
	addFilteredLayer: function(data){
		var that = this;
		var filterLayer = L.tileLayer.wms('http://geoblaster.info:8080/geoserver/hunts/wms',{
			 	layers:'hunts:draw_hunt',
			 	format: 'image/png',
			 	env:'element:'+data.label.toLowerCase(),
        	 	transparent: true
			});
			that.map.addLayer(filterLayer) 
		},

	initialize: function(options){
		this.options = options
	}
}); 


//DrawHuntsView