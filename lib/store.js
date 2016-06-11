"use strict";

function Store(opts) {

	this.version = 0.1;
	this.data = {};
}

// Get data from store
// --------------------------------------------------------------
// Retrieve at store[index]

Store.prototype.get = function(index) {

	try {
		return this.data[index].data;
	} catch (e) {
		return undefined;
	}
}

// Set data store based on passed structure
// --------------------------------------------------------------
// Index is the store index
// Data is the data structure

Store.prototype.set = function(index, data) {

	this.data[index] = {
		expires: this.expires || 100,
		timestamp: new Date().getTime(),
		data: data
	};
}

// User defined options
// --------------------------------------------------------------

Store.prototype.extend = function(opts) {

	this.expires = opts.expires;
	this.debug = opts.debug;
}

module.exports = Store;