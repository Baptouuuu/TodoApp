/**
	* Data model of a todo
*/

var App = App || {};

App.Model = App.Model || {};

App.Model.Todo = function (options){

	var options = options || {};
	
	this.guid = parseInt(options.guid) || 0;
	this.task = options.task || '';
	this.revision = options.revision || [];
	this.dueTimeStamp = options.dueTimeStamp || 0;
	this.sticky = options.sticky || 0;
	this.note = options.note || '';
	this.done = options.done || 0;
	this.list = parseInt(options.list) || 0;

};

App.Model.Todo.prototype = {

	/**
		* Create the todo in the database
	*/
	
	create: function () {
	
		IoC.Storage.create(
			'todos',
			{
				task: this.task,
				revision: this.revision,
				dueTimeStamp: this.dueTimeStamp,
				sticky: this.sticky,
				note: this.note,
				done: this.done,
				list: this.list
			},
			function (event) {
			
				this.guid = event.target.result;
				
				IoC.Mediator.publish('model.todo.created', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('storage.create.error');
			
			},
			this
		);
	
	},
	
	/**
		* Retrieve the todo content from the database via its guid
	*/
	
	read: function () {
	
		IoC.Storage.read(
			'todos',
			this.guid,
			function (event) {
			
				var r = event.target.result;
				
				this.task = r.task;
				this.revision = this.revision;
				this.dueTimeStamp = r.dueTimeStamp;
				this.sticky = r.sticky;
				this.note = r.note;
				this.done = r.done;
				this.list = r.list
				
				IoC.Mediator.publish('model.todo.retrieved', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('storage.retrieve.error');
			
			},
			this
		);
	
	},
	
	/**
		* Update todo content in the database
	*/
	
	update: function () {
	
		IoC.Storage.update(
			'todos',
			{
				guid: this.guid,
				task: this.task,
				revision: this.revision,
				dueTimeStamp: this.dueTimeStamp,
				sticky: this.sticky,
				note: this.note,
				done: this.done,
				list: this.list
			},
			function (event) {
			
				IoC.Mediator.publish('model.todo.updated', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('model.todo.update.error', [this]);
			
			},
			this
		);
	
	},
	
	/**
		* Delete the todo from the database
	*/
	
	destroy: function () {
	
		IoC.Storage.remove(
			'todos',
			this.guid,
			function (event) {
			
				IoC.Mediator.publish('model.todo.deleted', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('model.todo.delete.error', [this]);
			
			},
			this
		);
	
	}

};