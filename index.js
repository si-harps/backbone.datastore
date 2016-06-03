"use strict";

var Backbone = require('backbone');
var Store = require('./lib/store');
var extend = require('./lib/extend');

module.exports = (function(Backbone) {

	var store = new Store();

	// Preserve required original backbone methods
	// ----------------------------------------------------------

	var bProto = extend({}, { sync: Backbone.sync });

	// Deep copy required prototype objects
	// ----------------------------------------------------------
	// Required to call prototype functions passing context if no data found in store

	var cProto = extend({}, Backbone.Collection.prototype);
	var mProto = extend({}, Backbone.Model.prototype);

	// Private / helper methods
	// ----------------------------------------------------------

	// Get the data model uid from fetch url(root)
	// ----------------------------------------------------------

	function getuid(opts) {

		try { 
			return this.url(); 
		} catch (e) { 
			return this.url || this.urlRoot || undefined;
		}
	}

	// Backbone prototype overrides
	// ----------------------------------------------------------

	// Fetch method
	// ----------------------------------------------------------
	// Either fetches from server or datastore
	// Collection or model must have object store property set if to be saved to store
	// Continue as usual if no store property found

	function fetch(opts) {

		// Get URL to ensure unique id set for store
		// ------------------------------------------------------

		var uid = getuid.apply( this, [ opts ]);

		// Fetch data from store
		// ------------------------------------------------------

		var data = store.get(uid);

		// Ensure opts has at least an empty object as value
		// ------------------------------------------------------

		opts = opts || {};

		// If no value in store or no store property
		// ------------------------------------------------------
		// Continue with collection or model fetch as normal

		if (data === undefined || !uid || opts.remove === false) {
			
			return this instanceof Backbone.Collection 
				? cProto.fetch.apply(this, [ opts ])
				: mProto.fetch.apply(this, [ opts ])
		}

		// Store object found
		// ------------------------------------------------------
		// Data found in store so send back to caller

		var self = this;

		// Make deep copy of opts
		// ------------------------------------------------------
		// Required by sync trigger to ensure all opts passed by user are used

		opts = opts ? extend({}, opts) : {};

		// Attach store data to object being passed
		// ------------------------------------------------------
		// Prior to this was an empty model or collection being fetched

		extend(this, data);

		// Ensure user defined success callback is fired as expected
		// ------------------------------------------------------

		var success = opts.success;
		opts.success = function(response) {

			if (success) 
				success(self, response, opts);

			self.trigger('sync', self, response, opts);
		};

		// Opts success can safely be triggered
		// ------------------------------------------------------
		// Data from store ready for listeners / callback

		opts.success(this);
	}

	// Override sync method
	// ----------------------------------------------------------
	// Sets store value if store property set on instance

	function sync() {

		var uid = getuid.apply( this );

		if (uid)
			store.set(uid, this);

		// Continue with sync method as expected
		// ------------------------------------------------------
		
		return bProto.sync.apply(this, arguments)
	}

	// Extend backbone collection and model prototype
	// ----------------------------------------------------------
	// Augment model and collection prototypes with methods defined above

	extend(Backbone, { sync: sync });

	extend(Backbone.Collection.prototype, { 
		fetch: fetch,
		sync: sync,
	});

	extend(Backbone.Model.prototype, { 
		fetch: fetch,
		sync: sync,
	});

	// Expose store to client
	// ----------------------------------------------------------
	// This enables user defaults to be passed during intialization

	return store;

})(Backbone);