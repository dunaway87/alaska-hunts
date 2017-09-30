
var MapViewTmpl = require('draw-hunts/MapView.tmpl');


module.exports = Backbone.Marionette.ItemView.extend({
	id:'map',
	template:MapViewTmpl,

	onShow:function(){
		var that = this;
		log.debug("map options %o ",that.options)
		 var map = L.map('map',{
			center:[61.15,-149.9],
					zoom:4,
				
			});
	    var mapboxID ='dunaway87.hffcoej7';
			
		var	basemap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/'+mapboxID+'/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
				    baselayer: true

			});
			var wmsLayer = L.tileLayer.wms('http://geoblaster.info:8080/geoserver/hunts/wms',{
				 layers:'hunts:draw_hunt',
				 format: 'image/png',
				 env:'element:moose',
	        	 transparent: true
			});
			map.addLayer(basemap)
			map.addLayer(wmsLayer)
			
	},

	initialize:function(options){
		this.options=options
	}
				
})