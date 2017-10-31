var tmpl = require('draw-hunits/SuccessRate.tmpl');

module.exports = Backbone.Marionette.ItemeView.extend({
	template:tmpl,

	onShow: function(options){
		this.options = options
		$('#slider-range').slider({
			min:this.options.min,
			max:this.options.max,
		})



	},

	initialize: function(options){
		this.options = options
		this.model = new Backbone.model(this.options);

		this.options.min = this.model.get("min");
		this.options.max = this.model.get("max");


	}
})