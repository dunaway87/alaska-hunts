var api = require('api/HuntsAPI');

var tmpl = require('draw-hunts/SummaryView.tmpl');
var header_tmpl = require('draw-hunts/ModalHeader.tmpl');
var footer_tmpl = require('draw-hunts/ModalFooter.tmpl');
var modal_map_tmpl = require('draw-hunts/ModalMapView.tmpl');
var hunt_item_tmpl = require('draw-hunts/HuntItem.tmpl');
var hunt_comp_tmpl =require('draw-hunts/HuntComp.tmpl');
var hunt_summary_tmpl = require('draw-hunts/HuntSummary.tmpl');
var hunt_summary_comp_tmpl = require('draw-hunts/HuntSummaryComp.tmpl');
var hunt_title_tmpl = require('draw-hunts/HuntTitle.tmpl')

//var modal_hunts_tmpl = require('draw-hunts/ModalHunts.tmpl');
//var modal_hunt_summary_tmpl = require('draw-hunts/ModalHuntSummary.tmpl');

module.exports = Marionette.LayoutView.extend({
	    
	template:tmpl,
	className:"modal",
	regions:{
		modal_map:'.modal-map-container',
		modal_hunts:'.modal-hunts',
		modal_hunt_title:'.hunt-modal-title-region',
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
		this.options.data = {}

		this.options.map={};
		this.options.geojson={};

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
		modal_header_view.on('close:modal', function(){
			console.log("heheclose")
			that.trigger("shuttle:close");
		})

	},

	showModalFooter: function(){
		var that = this;

		var modal_footer_view = new ModalFooterView();
		that.getRegion('modal_footer').show(modal_footer_view);
		modal_footer_view.on('close:modal', function(){
			console.log("heheclose")
			that.trigger("shuttle:close");
		})
	},

	showModalMap:function(options){
		var that = this;
		
		that.getRegion('modal_map').show(new MapView(that.options))
	},

	showHunts:function(){
		var that = this;
		var lat = this.options.model.attributes.lat;
		var lon = this.options.model.attributes.lon;

		var url = "http://localhost:9000/pointData?lat="+lat+"&lon="+lon;
		console.log(url);


		var hunt_model = Backbone.Model.extend({
			urlRoot: url
		});
		console.log(hunt_model)
		var HuntCollection = Backbone.Collection.extend({
			url: url,
			model: hunt_model,
			parse: function(response, options) {
    			return response.data;
    			
  			}

		});	

		
		var collection = new HuntCollection();
		var modal_hunts = {}
		var layergroup = new L.LayerGroup();
		collection.fetch().done(function(){
			console.log("collection %o ", collection)
			modal_hunts = new ModalHunts({
				collection:collection
			})
			that.getRegion('modal_hunts').show(modal_hunts)


			modal_hunts.on("childview:show:huntsummary", function(childview,args){
				console.log("hunt summary %o ", args)
				var hunt_summary = new HuntSummaryView({
					model:args
				})
				var hunt_title_view = new HuntModalTitle({
					model:args
				})
				console.log("hunt args %o ", args.attributes.geometry)
				
				
				
				layergroup.clearLayers();

				that.options.geojson = args.attributes.geometry
				L.geoJSON(that.options.geojson).addTo(layergroup)
				that.options.map.addLayer(layergroup);
				that.options.map.fitBounds(L.geoJSON(that.options.geojson).getBounds());

				that.getRegion('modal_hunt_summary').show(hunt_summary)
				that.getRegion('modal_hunt_title').show(hunt_title_view)
			})
		});
	
			
		console.log("hunts up %o ", collection)

	},

	initialize: function(options){
		this.options = options;
	}

});	


var ModalHeaderView = Backbone.Marionette.ItemView.extend({
	template:header_tmpl,

	triggers:{
		"click .close": "close:modal",
	},

	closeModal:function(){
		var that = this;
		/*e.preventDefault();
		e.stopPropagation();*/
		console.log("close it down")
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



var HuntItem = Backbone.Marionette.ItemView.extend({
	template:hunt_item_tmpl,
	tagName:"tr",
	

	events:{
		'click': "showModalHuntSummary"

	},

	

	showModalHuntSummary: function(){
		console.log("hunt item view %o ", this.model)
		this.trigger("show:huntsummary", this.model)

	},

	serializeData: function(){
		var properties = this.model.attributes.properties["0"].value;
		return {
			label:this.model.get("label"),
			species:properties

		}
		
	}

	
})

var ModalHunts = Backbone.Marionette.CompositeView.extend({

	tagName:"table",
	className:"table table-hover",
	template:hunt_comp_tmpl,
	childView: HuntItem,


	initialize:function(options){
		var that = this;
		this.options = options
		this.collection = new Backbone.Collection(this.options.collection.models)
		
	} 
})

var HuntModalTitle = Backbone.Marionette.ItemView.extend({
	template:hunt_title_tmpl,
	

	serializeData: function(){
		
		return {
			label:this.model.get("label"),
			
		}
	},
})

var HuntSummaryItem = Backbone.Marionette.ItemView.extend({
	template:hunt_summary_tmpl,
	className:'.hunt-summary-detail',
	tagName:'tr',
	serializeData: function(){
		var properties = this.model.attributes.properties;
		
		return {
			label:this.model.get("label"),
			value:this.model.get("value")

		}
	},

	initialize:function(options){
		this.options = options
		
	}
	
})

var HuntSummaryView = Backbone.Marionette.CompositeView.extend({
	template:hunt_summary_comp_tmpl,
	childView:HuntSummaryItem,
	tagName:"table",
	className:"table table-striped",

	initialize:function(options){
		var that = this;
		this.options = options

		
		this.collection = new Backbone.Collection(this.model.attributes.properties)

		
	
	} 
})




var MapView = Marionette.View.extend({
	id:'modal-map',
	template:modal_map_tmpl,


	onShow:function(){	
		var that = this;
		
		that.options.map = L.map('modal-map',{
			center:[63,-149.9],
			zoom:3,
				
		});
	    var mapboxID ='dunaway87.hffcoej7';
			
		var	basemap = L.tileLayer('https://{s}.tiles.mapbox.com/v3/'+mapboxID+'/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
				    baselayer: true

			});
		that.options.map.addLayer(basemap);
			
	},

	initialize:function(options){
		this.options=options
	}
				
})