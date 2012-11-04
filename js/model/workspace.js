/**
	* Data model of a workspace
*/

var App = App || {};

App.Model = App.Model || {};

App.Model.Workspace = function (options){

	var options = options || {};
	
	this.guid = options.guid || 0;
	this.name = options.name || '';

};

App.Model.Workspace.prototype = {

	/**
		* Create the workspace in the database
	*/
	
	create: function () {
	
		IoC.Storage.create(
			'workspaces',
			{name: this.name},
			function (event) {
			
				this.guid = event.target.result;
				
				IoC.Mediator.publish('model.workspace.created', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('storage.create.error');
			
			},
			this
		);
	
	},
	
	/**
		* Retrieve content from the database via its guid
	*/
	
	read: function () {
	
		IoC.Storage.read(
			'workspaces',
			this.guid,
			function (event) {
			
				var r = event.target.result;
				
				this.name = r.name;
				
				IoC.Mediator.publish('model.workspace.retrieved', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('storage.retrieve.error');
			
			},
			this
		);
	
	},
	
	/**
		* Update workspace content in the database
	*/
	
	update: function () {
	
		IoC.Storage.update(
			'workspaces',
			{
				guid: this.guid,
				name: this.name
			},
			function (event) {
			
				IoC.Mediator.publish('model.workspace.updated', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('model.workspace.update.error', [this]);
			
			},
			this
		);
	
	},
	
	/**
		* Delete the workspace and attached lists and notes from the database
	*/
	
	destroy: function () {
	
		IoC.Storage.find(
			'lists',
			'workspace',
			this.guid,
			function (event) {
			
				var result = event.target.result,
					list = new App.Model.List();
				
				if (!!result === false) {
				
					return;
				
				}
				
				list.guid = result.value.guid;
				
				list.destroy();
				
				result.continue();
			
			},
			function (event) {},
			this
		);
		
		IoC.Storage.find(
			'notes',
			'workspace',
			this.guid,
			function (event) {
			
				var result = event.target.result,
					note = new App.Model.Note();
				
				if (!!result === false) {
				
					return;
				
				}
				
				note.guid = result.value.guid;
				
				note.destroy();
				
				result.continue();
			
			},
			function (event) {},
			this
		);
		
		IoC.Storage.remove(
			'workspaces',
			this.guid,
			function (event) {
			
				IoC.Mediator.publish('model.workspace.deleted', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('model.workspace.delete.error', [this]);
			
			},
			this
		);
	
	}

};