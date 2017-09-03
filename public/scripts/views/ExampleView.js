var api = require('api/ExampleAPI');

var routes = require('routes/ExampleRoutes');

var tmpl = require('example/ExampleView.tmpl');

//ExampleView
module.exports = Backbone.Marionette.LayoutView.extend({
	template: tmpl,
	className: 'examples',
	ui: {
		create : '.controls i.create',
	},
	/* 
		you may define events directly by their css selector
		or using the Marionette ui syntax for reuse
	*/
	events: {
		'click @ui.create': 'createArtist',
		'click ul li': 'showArtist'
	},
	createArtist: function(event) {
		event.preventDefault();

		log.debug('ExampleView.createArtist');
		log.debug('browse Material Icons at: http://glyphsearch.com/?library=material');

		$.ajax({
			type: "POST",
			url: api.artist(),
			data: {
				name: 'Jordan Jenckes'
			},
			success: function(data) {
				log.debug('saved %o', data);
			}
		});

	},
	showArtist: function(event) {
		event.preventDefault();

		var el = $(event.currentTarget);
		var id = el.data('id');

		log.debug('ExampleView.showArtist: %s %s', id, el.html());

		app.router.navigate(routes.artist(id), true);
	},
	bindFilterDropdown: function() {
		var that = this;

		$.getJSON(api.filters(), function(filters) {
			var html = '<option value="all">All</option>';
			_.each(filters, function(filter) {
				html += Mustache.render('<option value="{{id}}">{{name}}</option>', filter);
			});

			var select = that.$el.find('div.controls select');
			select.html(html);

			select.select2({
				//hide the search text field since there are few items
				minimumResultsForSearch: 99,

			}).on("change", function(event) {
				var $this = $(this);
				var id = $this.val();

				log.debug('selected filter: %s', id);

			});
		});
	},
	bindArtists: function() {
		var that = this;
		$.getJSON(api.artists(), function(artists) {
			var html = '';
			_.each(artists, function(artist) {
				html += Mustache.render('<li data-id="{{id}}"><a href="/example//artist/{{id}}">{{name}}</a></li>', artist);
			});

			that.$el.find('ul.example-list').html(html);
		});

	},
	onShow: function() {
		var that = this;

		log.debug('ExampleView.onShow');

		this.bindFilterDropdown();

		this.bindArtists();
	}
}); //ExampleView