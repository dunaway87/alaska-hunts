var tmpl = require('draw-hunts/DrawRate.tmpl');
var FilterModel = require('models/FilterModel');
module.exports = Backbone.Marionette.ItemView.extend({
	template:tmpl,
	className:".drawrate-slide",
	
	onShow: function(options){
		var that = this
		this.options = options
		var min = this.model.get("min");
		var max = this.model.get("max");
		log.debug("min in sho %o ", this.model.get("min"))
		$('#drawrange').slider({
			range:true,
			min: min,
			max: max,
			values:[ 20 ,50 ],
			change:that.getValues
		})



	},
	getValues:function(event, ui){
		var that = this;
		if(!(FilterModel.has("drawMin"))){
			FilterModel.set("drawMin",[])
		}
		if(!(FilterModel.has("drawMax"))){
			FilterModel.set("drawMax",[])
		}
		 if((FilterModel.has("drawMin"))){
			FilterModel.unset("drawMin",[])
			FilterModel.set("drawMin", []);
		} 
		if((FilterModel.has("drawMax"))){
			FilterModel.unset("drawMax",[])
			FilterModel.set("drawMax", []);
		} 
		FilterModel.get("drawMin").push(ui.values[ 0 ]);
		FilterModel.get("drawMax").push(ui.values[ 1 ]);
		log.debug('hehe')
		this.trigger("drawrate:filter", this.model);
	},
	triggess:function(){
		this.trigger("drawrate:filter", this.model);
	},

	initialize: function(options){
		
		this.options = options

		this.model = new Backbone.Model(this.options);

		log.debug("model %o ", this.model)
	}
})