var App = App || {};

App.Lib = App.Lib || {};

App.Lib.Storage = {

	database: null,
	
	init: function () {
	
		this.database = new App.Lib.IndexedDB(
			'projectIt_test', 
			1, 
			{
				workspaces: {
					options: {
						keyPath: 'guid',
						autoIncrement: true
					},
					defaultValues: {
						guid: 1,
						name: 'Inbox'
					}
				},
				lists: {
					options: {
						keyPath: 'guid',
						autoIncrement: true
					},
					indexes: {
						name: 'workspace',
						keyPath: 'workspace',
						options: {unique: false}
					},
					defaultValues: {
						guid: 1,
						name: 'Inbox',
						workspace: 1
					}
				},
				todos: {
					options: {
						keyPath: 'guid',
						autoIncrement: true
					},
					indexes: [
						{
							name: 'dueTimeStamp',
							keyPath: 'dueTimeStamp',
							options: {unique: false}
						},
						{
							name: 'sticky',
							keyPath: 'sticky',
							options: {unique: false}
						},
						{
							name: 'done',
							keyPath: 'done',
							options: {unique: false}
						},
						{
							name: 'list',
							keyPath: 'list',
							options: {unique: false}
						}
					]
				},
				notes: {
					options: {
						keyPath: 'guid',
						autoIncrement: true
					},
					indexes: {
						name: 'workspace',
						keyPath: 'workspace',
						options: {unique: false}
					}
				}
			},
			{
				fn: this.databaseOpened,
				context: this
			},
			{
				fn: this.databaseUpgraded,
				context: this
			}
		);
	
	},
	
	databaseOpened: function () {
	
		App.Lib.Mediator.publish('storage.opened');
	
	},
	
	databaseUpgraded: function (event) {
	
		setTimeout(
			function() {
			
				App.Lib.Mediator.publish('storage.opened');
			
			},
			100
		);
	
	},
	
	create: function (storeName, object, onSuccess, onError, context) {
	
		if (this.database instanceof App.Lib.IndexedDB) {
		
			this.database.create(storeName, object, onSuccess, onError, context);
			
		}
	
	},
	
	read: function (storeName, id, onSuccess, onError, context) {
	
		if (this.database instanceof App.Lib.IndexedDB) {
		
			this.database.read(storeName, id, onSuccess, onError, context);
		
		}
	
	},
	
	readAll: function (storeName, onSuccess, onError, context) {
	
		if (this.database instanceof App.Lib.IndexedDB) {
		
			this.database.readAll(storeName, onSuccess, onError, context);
		
		}
	
	},
	
	update: function (storeName, object, onSuccess, onError, context) {
	
		if (this.database instanceof App.Lib.IndexedDB) {
		
			this.database.update(storeName, object, onSuccess, onError, context);
		
		}
	
	},
	
	remove: function (storeName, id, onSuccess, onError, context) {
	
		if (this.database instanceof App.Lib.IndexedDB) {
		
			this.database.remove(storeName, id, onSuccess, onError, context);
		
		}
	
	},
	
	empty: function (storeName, onSuccess, onError, context) {
	
		if (this.database instanceof App.Lib.IndexedDB) {
		
			this.database.empty(storeName, onSuccess, onError, context);
		
		}
	
	},
	
	find: function (storeName, indexName, term, onSuccess, onError, context) {
	
		if (this.database instanceof App.Lib.IndexedDB) {
		
			this.database.find(storeName, indexName, term, onSuccess, onError, context);
		
		}
	
	}

};

App.Lib.Mediator.subscribe('app.init', App.Lib.Storage.init, App.Lib.Storage);