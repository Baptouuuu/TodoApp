/**
	* Data model of list
*/

var App = App || {};

App.Model = App.Model || {};

App.Model.List = function (options){

	var options = options || {};
	
	this.guid = parseInt(options.guid) || 0;
	this.name = options.name || '';
	this.workspace = parseInt(options.workspace) || 0;

};

App.Model.List.prototype = {

	/**
		* Create a list in the database
	*/ 
	
	create: function () {
	
		IoC.Storage.create(
			'lists',
			{
				name: this.name,
				workspace: this.workspace
			},
			function (event) {
			
				this.guid = event.target.result;
				
				IoC.Mediator.publish('model.list.created', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('storage.create.error');
			
			},
			this
		);
	
	},
	
	/**
		* Retrieve the content of a list from the database via its guid
	*/
	
	read: function () {
	
		IoC.Storage.read(
			'lists',
			this.guid,
			function (event) {
			
				var r = event.target.result;
				
				this.name = r.name;
				this.workspace = r.workspace;
				
				IoC.Mediator.publish('model.list.retrieved', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('storage.retrieve.error');
			
			},
			this
		);
	
	},
	
	/**
		* Update list content in the database
	*/
	
	update: function () {
	
		IoC.Storage.update(
			'lists',
			{
				guid: this.guid,
				name: this.name,
				workspace: this.workspace
			},
			function (event) {
			
				IoC.Mediator.publish('model.list.updated', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('model.list.update.error', [this]);
			
			},
			this
		);
	
	},
	
	/**
		* Delete the list and all attached todos from the database
	*/
	
	destroy: function () {
	
		IoC.Storage.find(
			'todos',
			'list',
			this.guid,
			function (event) {
			
				var result = event.target.result,
					todo = new App.Model.Todo();
				
				if (!!result === false) {
				
					return;
				
				}
				
				todo.guid = result.value.guid;
				
				todo.destroy();
				
				result.continue();
			
			},
			function (event) {},
			this
		);
		
		IoC.Storage.remove(
			'lists',
			this.guid,
			function (event) {
			
				IoC.Mediator.publish('model.list.deleted', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('model.list.delete.error', [this]);
			
			},
			this
		);
	
	}

};