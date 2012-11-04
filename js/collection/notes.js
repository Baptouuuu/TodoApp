/**
	* Stock all notes of the current workspace
	* It manipulates them depending on application events
*/

var App = App || {};

App.Collection = App.Collection || {};

App.Collection.Notes = {

	items: [],
	
	/**
		* Subscribe to needed application events
	*/
	
	initSubscribers: function () {
	
		IoC.Mediator.subscribe('wrapper.change.type', this.checkType, this);
		IoC.Mediator.subscribe('note.request.new', this.create, this);
		IoC.Mediator.subscribe('note.request.display', this.forward, this);
		IoC.Mediator.subscribe('note.request.delete', this.delete, this);
		IoC.Mediator.subscribe('note.update', this.update, this);
	
	},
	
	/**
		* Create a new note and add it to the collection when the user hit the add button
	*/
	
	create: function (workspaceGuid) {
	
		var note = new App.Model.Note({
			workspace: workspaceGuid
		});
		
		note.create();
		
		this.items.push(note);
	
	},
	
	/**
		* Retrieve all notes of the wished workspace
	*/
	
	getAll: function (workspaceGuid) {
	
		this.items = [];
		
		IoC.Storage.find(
			'notes',
			'workspace',
			parseInt(workspaceGuid),
			function (event) {
			
				var result = event.target.result,
					note = new App.Model.Note();
				
				if (!!result === false) {
				
					IoC.Mediator.publish('notes.retrieved', [this.items]);
					
					return;
				
				}
				
				note.guid = result.value.guid;
				note.text = result.value.text;
				note.workspace = result.value.workspace;
				
				this.items.push(note);
				result.continue();
			
			},
			function (event) {
			
				IoC.Mediator.publish('retrieve.error');
			
			},
			this
		);
	
	},
	
	/**
		* Called when user navigates through tasks and notes
		* If notes it retrieves them all
	*/
	
	checkType: function (type, workspaceGuid) {
	
		if (type === 'notes') {
		
			this.getAll(workspaceGuid);
		
		}
	
	},
	
	/**
		* Called when the user want to see a note
		* It forward to the rest of the application the note object needed
		* (will be used by the view)
	*/
	
	forward: function (liElement) {
	
		for (var i = 0, l = this.items.length; i < l; i++) {
		
			if (this.items[i].guid == liElement.dataset.guid) {
			
				IoC.Mediator.publish('note.display', [this.items[i], liElement]);
				
				break;
			
			}
		
		}
	
	},
	
	/**
		* Update the note content when the user hit the save button
	*/
	
	update: function (noteGuid, text) {
	
		for (var i = 0, l = this.items.length; i < l; i++) {
		
			if (this.items[i].guid == noteGuid) {
			
				var note = this.items[i];
				
				note.text = text;
				note.update();
				
				break;
			
			}
		
		}
	
	},
	
	/**
		* Delete a note from the collection and the database
	*/
	
	delete: function (liElement) {
	
		for (var i = 0, l = this.items.length; i < l; i++) {
		
			if (this.items[i].guid == liElement.dataset.guid) {
			
				this.items[i].destroy();
				this.items.splice(i, 1);
				
				break;
			
			}
		
		}
	
	}

};

App.Collection.Notes.initSubscribers();