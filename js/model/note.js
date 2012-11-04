/**
	* Data model of a note
*/

var App = App || {};

App.Model = App.Model || {};

App.Model.Note = function (options) {

	var options = options || {};
	
	this.guid = parseInt(options.guid) || 0;
	this.text = options.text || '';
	this.workspace = parseInt(options.workspace) || 0;

};

App.Model.Note.prototype = {

	/**
		* Create a note in the database
	*/
	
	create: function () {
	
		IoC.Storage.create(
			'notes',
			{
				text: this.text,
				workspace: this.workspace
			},
			function (event) {
			
				this.guid = event.target.result;
				
				IoC.Mediator.publish('model.note.created', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('storage.create.error');
			
			},
			this
		);
	
	},
	
	/**
		* Retrieve note content from the database via its guid
	*/
	
	read: function () {
	
		IoC.Storage.read(
			'notes',
			this.guid,
			function (event) {
			
				var r = event.target.result;
				
				this.text = r.text;
				this.workspace = r.workspace;
				
				IoC.Mediator.publish('model.note.retrieved', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('storage.retrieve.error');
			
			},
			this
		);
	
	},
	
	/**
		* Update note content in the database
	*/
	
	update: function () {
	
		IoC.Storage.update(
			'notes',
			{
				guid: this.guid,
				text: this.text,
				workspace: this.workspace
			},
			function (event) {
			
				IoC.Mediator.publish('model.note.updated', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('model.note.update.error', [this]);
			
			},
			this
		);
	
	},
	
	/**
		* Delete the note from the database
	*/
	
	destroy: function () {
	
		IoC.Storage.remove(
			'notes',
			this.guid,
			function (event) {
			
				IoC.Mediator.publish('model.note.deleted', [this]);
			
			},
			function (event) {
			
				IoC.Mediator.publish('model.note.delete.error', [this]);
			
			},
			this
		);
	
	}

};