var api = require('api/HuntsAPI');
var tmpl = require('draw-hunts/SidebarLayout.tmpl');
var RangeCompTmpl = require('draw-hunts/RangeCompTmpl.tmpl');
var RangeItemTmpl = require('draw-hunts/RangeItemTmpl.tmpl');
var FiltersCollectionTmpl = require('draw-hunts/FiltersCollectionTmpl.tmpl');
var SpeciesFiltersView = require('views/filters/SpeciesFilterView');
var UnitsFilterView = require('views/filters/UnitsFilterView');
var FilterModel	= require("models/FilterModel");
var SubunitsFilterView = require('views/filters/SubunitsFilterView');
var SuccessRateView = require('views/filters/SuccessRateView');
var DrawRateView = require('views/filters/DrawRateView');


module.exports = Backbone.Marionette.LayoutView.extend({
	template: tmpl,
	className: '.filters',

	regions:{
		species:"#species-container",
		units:"#units-container",
		subunits:"#subunits-container",
		successrate:"#successrate-container",
		drawrate:"#drawrate-container",
	},


	onShow: function(options){
		this.showFilters();
		log.debug("side layout")

		
	},


	showFilters: function(options){
			
		var that = this;
			$.getJSON(api.filters(), function(filters){
				that.showSuccesFilter(filters.successrate);
				that.showDrawRate(filters.drawrate);

				log.debug("filters %o ", filters.species)
				var species_filters_view = new SpeciesFiltersView({
					model: new Backbone.Collection(filters.species.range)
				})

				var units_filter_view = new UnitsFilterView({
					model: new Backbone.Collection(filters.unit.range)
				})

				var subunits_filter_view = new SubunitsFilterView({
					model: new Backbone.Collection(filters.subunit.range)
				})

				

				that.getRegion('species').show(species_filters_view);
				that.getRegion('units').show(units_filter_view);
				that.getRegion('subunits').show(subunits_filter_view)

				var speciesCql= null;
				var unitsCql = null;
				var subunitsCql = null;
				species_filters_view.on('hunt:filter',function(data){
					var filterData = FilterModel.toJSON();
					for(var i in filterData){
						var key = i;
						var value = filterData[i]
						for(var j in value){
							var val = value[j]
						}
					
					}
					log.debug("species filters %o ",FilterModel.toJSON());
					that.options.speciesFilter=data.label;
					speciesCql= key+"="+"\'"+val.toLowerCase()+"\'"
					log.debug("unitsCql %o ", unitsCql)

					if(speciesCql && unitsCql && subunitsCql !==null){
						cqlFilter=speciesCql+" and "+unitsCql+" and "+subunitsCql
					}else if(speciesCql && unitsCql !==null){
						cqlFilter=speciesCql+" and "+unitsCql
					}else if(speciesCql !==null){
						cqlFilter = speciesCql  
					}else if(unitsCql !==null){
						cqlFilter = unitsCql 
					}else if(subunitsCql !==null){
						cqlFilter = subunitsCql 
					}else{
						cqlFilter = "species='moose'";
					}

					that.options.wmsLayer.setParams({
						CQL_FILTER:cqlFilter
					})	
					/*that.options.wmsLayer.setParams({
						CQL_FILTER:'species='+ "\'"+data.label.toLowerCase()+"\'"
						
					})	*/

				})

				
				units_filter_view.on('hunt:filter',function(){
					
					log.debug("units filter, %o ", FilterModel.toJSON());
					
					var filterData = FilterModel.toJSON();
					for(var i in filterData){
						var key = i;
						var value = filterData[i]
						for(var j in value){
							var val = value[j]
						}
						
						unitsCql = key+"="+"\'"+val+"\'"
						log.debug("unitsCql %o ", unitsCql);

					} 

					if(speciesCql && unitsCql && subunitsCql !==null){
						cqlFilter=speciesCql+" and "+unitsCql+" and "+subunitsCql
					}else if(speciesCql && unitsCql !==null){
						cqlFilter=speciesCql+" and "+unitsCql
					}else if(speciesCql !==null){
						cqlFilter = speciesCql  
					}else if(unitsCql !==null){
						cqlFilter = unitsCql 
					}else if(subunitsCql !==null){
						cqlFilter = subunitsCql 
					}else{
						cqlFilter = "species='moose'";
					}

					that.options.wmsLayer.setParams({
						CQL_FILTER:cqlFilter
					})	
					
				})	

				subunits_filter_view.on('hunt:filter',function(){
					
					log.debug("subunits filter, %o ", FilterModel.toJSON());
					
					var filterData = FilterModel.toJSON();
					for(var i in filterData){
						var key = i;
						var value = filterData[i]
						for(var j in value){
							var val = value[j]
						}
						
						subunitsCql = key+"="+"\'"+val+"\'"
						log.debug("subunitsCql %o ", subunitsCql);

					} 

					if(speciesCql && unitsCql && subunitsCql !==null){
						cqlFilter=speciesCql+" and "+unitsCql+" and "+subunitsCql
					}else if(speciesCql && unitsCql !==null){
						cqlFilter=speciesCql+" and "+unitsCql
					}else if(speciesCql !==null){
						cqlFilter = speciesCql  
					}else if(unitsCql !==null){
						cqlFilter = unitsCql 
					}else if(subunitsCql !==null){
						cqlFilter = subunitsCql 
					}else{
						cqlFilter = "species='moose'";
					}

					that.options.wmsLayer.setParams({
						CQL_FILTER:cqlFilter
					})	
					
				})		
				
			})

		},



		showSuccesFilter:function(data){
			var that =this;
			log.debug("successrate %o ", data.range)
			var successrate_view = new SuccessRateView(data.range)

			that.getRegion('successrate').show(successrate_view);

		},

		showDrawRate: function(data){
			var that= this;
			log.debug("draw %o ", data.range)
			var drawrate_view = new DrawRateView(data.range);

			that.getRegion('drawrate').show(drawrate_view);
			drawrate_view.on('drawrate:filter', function(){
				log.debug("drawrate filter %o ", FilterModel)
			})
		},


		initialize: function(options){
			this.options = options;
			log.debug("hehe %o ", options)
			this.model = new Backbone.Model();
		}


	}); 




