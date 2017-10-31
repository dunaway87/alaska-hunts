var tmpl = require('draw-hunts/SuccessRate.tmpl');

module.exports = Backbone.Marionette.ItemView.extend({
	template:tmpl,
	className:".success-slide",

	onShow: function(options){
		var that = this
		this.options = options
		var min = this.model.get("min");
		var max = this.model.get("max");
		log.debug("min in sho %o ", this.model.get("min"))
		$('#slider-range').slider({
			range:true,
			min: min,
			max: max,
			values:[ 20 ,50 ]
		})



	},

	initialize: function(options){
		
		this.options = options
		this.model = new Backbone.Model(this.options);

	
	}
})