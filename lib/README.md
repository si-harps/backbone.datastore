# Backbone DataStore

### Installation

```npm install backbone.datastore```

### CommonJS

```
// This is the top of my Backbone application!

var Backbone = require('backbone'); // Must be required prior to data store

var DataStore = require('backbone.datastore');
DataStore.extend({
	expires: 20 // Content expiry in seconds
	debug: true // Output debugging log
});
```

### Disable data storage

```
var realtimeCollection = Backbone.Collection.extend({
	store: false,

	// ...other options here
})
```

### Options

...