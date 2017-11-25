var api = require('api/HuntsAPI');

var tmpl = require('draw-hunts/SummaryView.tmpl');
var header_tmpl = require('draw-hunts/ModalHeader.tmpl');
var footer_tmpl = require('draw-hunts/ModalFooter.tmpl');
var modal_map_tmpl = require('draw-hunts/ModalMapView.tmpl');
//var modal_hunts_tmpl = require('draw-hunts/ModalHunts.tmpl');
//var modal_hunt_summary_tmpl = require('draw-hunts/ModalHuntSummary.tmpl');

module.exports = Marionette.LayoutView.extend({
	    
	template:tmpl,
	className:"modal",
	regions:{
		modal_map:'.modal-map-container',
		modal_hunts:'.modal-hunts',
		modal_hunt_summary:'.modal-hunt-summary',
		modal_header:'#hunt-modal-header',
		modal_footer:'#hunt-modal-footer',
	},

	onShow: function(){
		require.ensure([], function() {
			require("leaflet/leaflet.css");
			require("leaflet/leaflet.js");
			require("leaflet/leaflet-src.js");
		});

		this.showModalHeader();
		this.showModalFooter();
		this.showModalMap();
		this.showHunts();
		//this.showHuntSummary();
	},


	showModalHeader: function(){
		var that = this;
		var modal_header_view = new ModalHeaderView();

		that.getRegion('modal_header').show(modal_header_view);
	},

	showModalFooter: function(){
		var that = this;

		var modal_footer_view = new ModalFooterView();
		that.getRegion('modal_footer').show(modal_footer_view);
	},

	showModalMap:function(){
		var that = this;
		console.log("hehe")
		that.getRegion('modal_map').show(new MapView())
	},

	showHunts:function(){
		console.log("hunts up %o ", this.options)
	},

	initialize: function(options){
		this.options = options;
	}

});	


var ModalHeaderView = Backbone.Marionette.ItemView.extend({
	template:header_tmpl,

	triggers:{
		"click .header-closer": "close:modal",
	},

	closeModal:function(e){
		e.preventDefault();
		e.stopPropagation();
		this.trigger("close:modal")
	}
});

var ModalFooterView = Backbone.Marionette.ItemView.extend({
	template:footer_tmpl,

	triggers:{
		"click .footer-closer":"close:modal",
	},

	closeModal:function(e){
		e.preventDefault();
		e.stopPropagation();
		this.trigger("close:modal")
	}
})

var MapView = Marionette.View.extend({
	id:'modal-map',
	template:modal_map_tmpl,


	onShow:function(){	
		var that = this;
		
		var map = L.map('modal-map',{
			center:[63,-149.9],
			zoom:3,
				
		});
	    var mapboxID ='dunaway87.hffcoej7';
			
		var	basemap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/'+mapboxID+'/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
				    baselayer: true

			});
		map.addLayer(basemap);
			
	},

	initialize:function(options){
		this.options=options
	}
				
})