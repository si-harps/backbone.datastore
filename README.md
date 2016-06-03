# Backbone DataStore

```npm install backbone.datastore```

### Introduction

Once required, collection and model data will be cached in memory for { this.expires }'s seconds after the initial fetch. All models and collections will be cached unless the object's store property is set to false like so...

```javascript
var realtimeCollection = Backbone.Collection.extend({
	store: false,

	// ...other options here
})
```

Once the cached data has expired, the subsequent fetch request will fetch from REST endpoint and recache repeating the cycle.

### CommonJS

```javascript
// This is the top of my Backbone application!

var Backbone = require('backbone'); // Must be required prior to data store

var DataStore = require('backbone.datastore');
DataStore.extend({
	expires: 20 // Content expiry in seconds
	debug: true // Output debugging log
});
```

### Disable data storage

At class level...

```javascript
var realtimeCollection = Backbone.Collection.extend({
	store: false,

	// ...other options here
})
```

At instance level...

```javascript
var realtimeInstance = new realtimeCollection({ store: false })
```

### Options

...