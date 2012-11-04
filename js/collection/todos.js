/**
	* Stock all todos of the current list
	* It manipulates them depending on application events
*/

var App = App || {};

App.Collection = App.Collection || {};

App.Collection.Todos = {

	items: [],
	
	/**
		* List id currently displayed
	*/
	
	currentList: null,
	
	/**
		* Subscribe to needed application events
	*/
	
	initSubscribers: function () {
	
		IoC.Mediator.subscribe('lists.retrieved', this.getAll, this);
		IoC.Mediator.subscribe('list.changed', this.listChanged, this);
		IoC.Mediator.subscribe('model.list.created', this.listCreated, this);
		IoC.Mediator.subscribe('model.todo.add', this.create, this);
		IoC.Mediator.subscribe('todo.done.toggle', this.toggleDone, this);
		IoC.Mediator.subscribe('todo.sticky.toggle', this.toggleSticky, this);
		IoC.Mediator.subscribe('todo.revision.add', this.addRevision, this);
		IoC.Mediator.subscribe('todo.delete', this.delete, this);
		IoC.Mediator.subscribe('todo.note.request.display', this.getNote, this);
		IoC.Mediator.subscribe('todo.note.save', this.saveNote, this);
	
	},
	
	/**
		* Create a new task when the user hit enter on the task input
	*/
	
	create: function (el) {
	
		var todo = new App.Model.Todo({
			task: el.value,
			list: this.currentList
		});
		
		todo.create();
		
		this.items.push(todo);
		
		this.items.sort(this.sort);
	
	},
	
	/**
		* Retrieve all todos from the first element of the lists array 
	*/
	
	getAll: function (lists) {
	
		if (lists.length === 0) {
		
			return;
		
		}
		
		this.items = [];
		this.currentList = lists[0].guid;
		
		App.Lib.Storage.find(
			'todos',
			'list',
			lists[0].guid,
			function (event) {
			
				var result = event.target.result,
					todo = new App.Model.Todo();
				
				if (!!result === false) {
				
					this.items.sort(this.sort);
					
					IoC.Mediator.publish('todos.retrieved', [this.items]);
					
					return;
				
				}
				
				todo.guid = result.value.guid;
				todo.task = result.value.task;
				todo.revision = result.value.revision;
				todo.dueTimeStamp = result.value.dueTimeStamp;
				todo.sticky = result.value.sticky;
				todo.note = result.value.note;
				todo.done = result.value.done;
				todo.list = result.value.list;
				todo.workspace = result.value.workspace;
				
				this.items.push(todo);
				result.continue();
			
			},
			function (event) {
			
				IoC.Mediator.publish('retrieve.error');
			
			},
			this
		);
	
	},
	
	/**
		* Called when the user want to see an other list
		* it calls getAll with as parameter an array with only the List object we want
	*/
	
	listChanged: function (listGuid) {
	
		var list = new App.Model.List({
			guid: listGuid
		});
		
		this.getAll([list]);
	
	},
	
	/**
		* Updates the currentList property when a new list is created
		* because the list will automatically be displayed
	*/
	
	listCreated: function (list) {
	
		this.currentList = list.guid;
	
	},
	
	/**
		* Sort todos of the collection via Todo.guid in descending mode
		* So newer todos will be displayed first
	*/
	
	sort: function (a, b) {
	
		return b.guid - a.guid;
	
	},
	
	/**
		* Change the done property of the wished todo and save it in the database
	*/
	
	toggleDone: function (todoGuid) {
	
		for (var i = 0, l = this.items.length; i < l; i++) {
		
			if (this.items[i].guid == todoGuid) {
			
				var todo = this.items[i];
				
				(todo.done === true) ? todo.done = false : todo.done = true;
				
				todo.update();
				
				break;
			
			}
		
		}
	
	},
	
	/**
		* Change the sticky property of the wished todo and save it in the database
	*/
	
	toggleSticky: function (todoGuid) {
	
		for (var i = 0, l = this.items.length; i < l; i++) {
		
			if (this.items[i].guid == todoGuid) {
			
				var todo = this.items[i];
				
				(todo.sticky === true) ? todo.sticky = false : todo.sticky = true;
				
				todo.update();
				
				break;
			
			}
		
		}
	
	},
	
	/**
		* Add an element to the revision array of a todo and save it
	*/
	
	addRevision: function (el) {
	
		for (var i = 0, l = this.items.length; i < l; i++) {
		
			if (this.items[i].guid == el.dataset.guid) {
			
				var todo = this.items[i];
				
				todo.revision.push(el.value);
				todo.update();
				
				IoC.Mediator.publish('todo.revision.added', [el]);
				
				break;
			
			}
		
		}
	
	},
	
	/**
		* Delete a todo from the collection and the database
	*/
	
	delete: function (todoGuid) {
	
		for (var i = 0, l = this.items.length; i < l; i++) {
		
			if (this.items[i].guid == todoGuid) {
			
				this.items[i].destroy();
				this.items.splice(i, 1);
				
				break;
			
			}
		
		}
	
	},
	
	/**
		* Forward the wished Todo object when the user want to edit the todo note to the rest of the application
		* (will be used in the view)
	*/
	
	getNote: function (formElement, todoGuid) {
	
		for (var i = 0, l = this.items.length; i < l; i++) {
		
			if (this.items[i].guid == todoGuid) {
			
				IoC.Mediator.publish('todo.note.display', [formElement, this.items[i]]);
				
				break;
			
			}
		
		}
	
	},
	
	/**
		* Update a todo note and save it when the user hit the save button
	*/
	
	saveNote: function (formElement) {
	
		for (var i = 0, l = this.items.length; i < l; i++) {
		
			if (this.items[i].guid == formElement.dataset.guid) {
			
				var todo = this.items[i];
				
				todo.note = formElement.querySelector('.txta').value;
				todo.update();
				
				break;
			
			}
		
		}
	
	}

};

App.Collection.Todos.initSubscribers();