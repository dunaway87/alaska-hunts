var api = require('api/HuntsAPI');
var tmpl = require('draw-hunts/SidebarLayout.tmpl');
var RangeCompTmpl = require('draw-hunts/RangeCompTmpl.tmpl');
var RangeItemTmpl = require('draw-hunts/RangeItemTmpl.tmpl');
var FiltersCollectionTmpl = require('draw-hunts/FiltersCollectionTmpl.tmpl');
var SpeciesFiltersView = require('views/filters/SpeciesFilterView');
var UnitsFilterView = require('views/filters/UnitsFilterView');
var FilterModel	= require("models/FilterModel");
var SuccessRateView = require('views/filters/SuccessRateView');
var DrawRateView = require('views/filters/DrawRateView');

module.exports = Backbone.Marionette.LayoutView.extend({
	template: tmpl,
	className: '.filters',

	regions:{
		species:"#species-container",
		units:"#units-container",
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

				

				that.getRegion('species').show(species_filters_view);
				that.getRegion('units').show(units_filter_view);

				species_filters_view.on('hunt:filter',function(data){
					var filterData = FilterModel.toJSON();
					for(var i in filterData){
						var key = i;
						var value = filterData[i]
						for(var j in value){
							var val = value[j]
						}
						log.debug("key %s ", key)
						log.debug("value %s ", val)
					}
					log.debug("heheh %o ",FilterModel.toJSON());
					that.options.speciesFilter=data.label;

					that.options.wmsLayer.setParams({
						CQL_FILTER:'species='+ "\'"+data.label.toLowerCase()+"\'"
						//CQL_FILTER:'unit='+data.label
					})	

				})

				var cqlFilter;
				units_filter_view.on('hunt:filter',function(){
					
					log.debug("heheh, %o ", FilterModel.toJSON());
					
					var filterData = FilterModel.toJSON();
					for(var i in filterData){
						var key = i;
						var value = filterData[i]
						for(var j in value){
							var val = value[j]
						}
						log.debug("key %s ", key)
						log.debug("value %s ", val)

						cqlFilter = key+":="+"\'"+val+"\'"

					}


					that.options.wmsLayer.setParams({
						//CQL_FILTER:'unit='+ "\'"+data.label/*.toLowerCase()*/+"\'"
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




