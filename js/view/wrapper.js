/**
	* Handles UI for the main content area
*/

var App = App || {};

App.View = App.View || {};

App.View.Wrapper = {

	templates: {
		wrapper: null,
		list: null,
		note: null,
		todo: null,
		deleteWorkspace: null,
		newList: null,
		deleteList: null,
		todoNote: null
	},
	wrapper: null,
	wrapperTitle: null,
	sidebar: null,
	content: null,
	todos: {
		add: null,
		list: null
	},
	note: {
		wrapper: null,
		txta: null
	},
	
	/**
		* Display the popup passed as parameter
	*/
	
	initSubscribers: function () {
	
		IoC.Mediator.subscribe('workspaces.retrieved', this.init, this);
		IoC.Mediator.subscribe('menu.workspace.added', this.workspace.change, this);
		IoC.Mediator.subscribe('workspace.display', this.workspace.display, this);
		IoC.Mediator.subscribe('wrapper.change.type', this.changeType, this);
		IoC.Mediator.subscribe('lists.retrieved', this.list.fillAll, this);
		IoC.Mediator.subscribe('todos.retrieved', this.todo.fillAll, this);
		IoC.Mediator.subscribe('workspace.request.delete', this.workspace.displayDeleteForm, this);
		IoC.Mediator.subscribe('workspace.request.delete.canceled', this.workspace.hideDeleteForm, this);
		IoC.Mediator.subscribe('workspace.request.delete.submit', this.workspace.hideDeleteForm, this);
		IoC.Mediator.subscribe('todo.request.new', this.list.displayNewForm, this);
		IoC.Mediator.subscribe('list.request.new.canceled', this.list.hideNewForm, this);
		IoC.Mediator.subscribe('list.request.new.submit', this.list.add, this);
		IoC.Mediator.subscribe('model.list.created', this.list.fill, this);
		IoC.Mediator.subscribe('list.display', this.list.change, this);
		IoC.Mediator.subscribe('list.request.delete', this.list.displayDeleteForm, this);
		IoC.Mediator.subscribe('list.request.delete.canceled', this.list.hideDeleteForm, this);
		IoC.Mediator.subscribe('list.request.delete.submit', this.list.delete, this);
		IoC.Mediator.subscribe('model.todo.created', this.todo.add, this);
		IoC.Mediator.subscribe('todo.done.toggle', this.todo.toggleDone, this);
		IoC.Mediator.subscribe('todo.sticky.toggle', this.todo.toggleSticky, this);
		IoC.Mediator.subscribe('todo.revision.added', this.todo.addRevision, this);
		IoC.Mediator.subscribe('model.todo.deleted', this.todo.delete, this);
		IoC.Mediator.subscribe('todo.note.display', this.todo.displayNote, this);
		IoC.Mediator.subscribe('todo.note.hide', this.todo.hideNote, this);
		IoC.Mediator.subscribe('todo.note.save', this.todo.hideNote, this);
		IoC.Mediator.subscribe('notes.retrieved', this.note.fillAll, this);
		IoC.Mediator.subscribe('model.note.created', this.note.fill, this);
		IoC.Mediator.subscribe('note.display', this.note.change, this);
		IoC.Mediator.subscribe('model.note.deleted', this.note.delete, this);
		IoC.Mediator.subscribe('model.note.updated', this.note.update, this);
	
	},
	
	/**
		* Retrieves templates, put them in the DOM and init the wrapper to display the first workspace
	*/
	
	init: function (workspaces) {
	
		this.templates.wrapper = document.body.querySelector('#tpl_wrapper');
		this.templates.list = document.body.querySelector('#tpl_list');
		this.templates.note = document.body.querySelector('#tpl_note');
		this.templates.todo = document.body.querySelector('#tpl_todo');
		this.templates.deleteWorkspace = document.body.querySelector('#tpl_workspace_delete_form');
		this.templates.newList = document.body.querySelector('#tpl_list_new_form');
		this.templates.deleteList = document.body.querySelector('#tpl_list_delete_form');
		this.templates.todoNote = document.body.querySelector('#tpl_todo_note_form');
		
		document.body.querySelector('#menu').insertAdjacentHTML('afterend', this.templates.wrapper.innerHTML);
		
		this.wrapper = document.body.querySelector('#wrapper');
		this.wrapperTitle = this.wrapper.querySelector('#w_top h1');
		this.sidebar = this.wrapper.querySelector('#wc_list ul');
		this.content = this.wrapper.querySelector('#wc_content');
		this.todos.add = this.content.querySelector('#wcc_todos .input');
		this.todos.list = this.content.querySelector('#wcc_todos ul');
		this.note.wrapper = this.content.querySelector('#wcc_note');
		this.note.txta = this.note.wrapper.querySelector('.txta');
		
		this.wrapper.insertAdjacentHTML('afterend', this.templates.deleteWorkspace.innerHTML);
		this.wrapper.insertAdjacentHTML('afterend', this.templates.newList.innerHTML);
		this.wrapper.insertAdjacentHTML('afterend', this.templates.deleteList.innerHTML);
		this.wrapper.insertAdjacentHTML('afterend', this.templates.todoNote.innerHTML);
		
		//if there are workspaces we init the wrapper with the first one in the list
		if (workspaces[0] !== undefined) {
		
			var w = workspaces[0];
			
			this.wrapper.dataset.workspace = w.guid;
			this.wrapperTitle[innerTextProperty] = w.name;
		
		}
		
		console.log('Wrapper View initialized!');
		
		IoC.Mediator.publish('view.wrapper.inited');
	
	},
	
	workspace: {
	
		/**
			* Alias of the display method
			* The expected parameter is a workspace object
		*/
		
		change: function (workspace) {
		
			App.View.Wrapper.workspace.display(workspace.guid, workspace.name);
		
		},
		
		/**
			* Display the wished workspace and init the view with the todos
		*/
		
		display: function (guid, name) {
		
			var self = App.View.Wrapper;
			
			if (self.wrapper.dataset.workspace != guid) {
			
				self.wrapper.dataset.workspace = guid;
				self.wrapperTitle[innerTextProperty] = name;
				
				self.changeType('tasks');
				
				IoC.Mediator.publish('wrapper.workspace.changed', [guid, name]);
			
			}
		
		},
		
		/**
			* Display the form to delete the workspace
		*/
		
		displayDeleteForm: function (formElement) {
		
			formElement.dataset.workspace = App.View.Wrapper.wrapper.dataset.workspace;
			
			IoC.Mediator.publish('popup.display', [formElement]);
		
		},
		
		/**
			* Hide the form to delete the workspace
		*/
		
		hideDeleteForm: function (formElement) {
		
			IoC.Mediator.publish('popup.hide', [formElement]);
		
		}
	
	},
	
	/**
		* Remove data from the wrapper UI when the user change data type (todos or notes)
	*/
	
	changeType: function (type, workspaceGuid) {
	
		this.wrapper.dataset.type = type;
		this.sidebar.innerHTML = '';
		this.todos.list.innerHTML = '';
		this.note.txta.innerHTML = '';
		this.note.txta.value = '';
	
	},
	
	list: {
	
		/**
			* Display all lists in the sidebar
		*/
		
		fillAll: function (lists) {
		
			var self = App.View.Wrapper,
				html = '';
			
			for (var i = 0, length = lists.length; i < length; i++) {
			
				html += self.templates.list.innerHTML.replace(/{{guid}}/g, lists[i].guid)
													 .replace(/{{name}}/g, lists[i].name);
			
			}
			
			self.sidebar.innerHTML = html;
			
			firstEl = self.sidebar.querySelector('li:first-child');
			firstEl.classList.add('selected');
			
			IoC.Mediator.publish('view.lists.filled');
		
		},
		
		/**
			* Display the form to add a new list
		*/
		
		displayNewForm: function (formElement) {
		
			IoC.Mediator.publish('popup.display', [formElement]);
			
			//focus not working before displaying the popup because it's hidden
			formElement.querySelector('.input').focus();
		
		},
		
		/**
			* Hide the form to add a new list
		*/
		
		hideNewForm: function (formElement) {
		
			var input = formElement.querySelector('.input[name="new_list_name"]');
			
			input.value = '';
			input.classList.remove('error');
			
			IoC.Mediator.publish('popup.hide', [formElement]);
		
		},
		
		/**
			* Notify the app to add a new list in the database
		*/
		
		add: function (formElement) {
		
			var self = App.View.Wrapper,
				input = formElement.querySelector('.input[name="new_list_name"]');
			
			if (input.checkValidity()) {
			
				var value = input.value;
				
				self.list.hideNewForm(formElement);
				
				IoC.Mediator.publish('model.list.add', [value, self.wrapper.dataset.workspace]);
			
			} else {
			
				input.classList.add('error');
			
			}
		
		},
		
		/**
			* Add a list in the sidebar
		*/
		
		fill: function (list) {
		
			var self = App.View.Wrapper,
				lis = [];
			
			self.sidebar.innerHTML += self.templates.list.innerHTML.replace(/{{guid}}/g, list.guid)
																   .replace(/{{name}}/g, list.name);
			
			lis = self.sidebar.querySelectorAll('li');
			
			for (var i = 0, l = lis.length; i < l; i++) {
			
				if (lis[i].dataset.guid == list.guid) {
				
					lis[i].classList.add('selected');
				
				} else {
				
					lis[i].classList.remove('selected');
				
				}
			
			}
			
			self.todos.list.innerHTML = '';
			
			IoC.Mediator.publish('view.list.filled');
		
		},
		
		/**
			* Change the list to display
		*/
		
		change: function (el) {
		
			var self = App.View.Wrapper,
				selected = self.sidebar.querySelector('.list.selected');
			
			if (selected !== null) {
			
				selected.classList.remove('selected');
			
			}
			
			el.classList.add('selected');
			
			self.todos.list.innerHTML = '';
			
			IoC.Mediator.publish('list.changed', [el.dataset.guid]);
		
		},
		
		/**
			* Display the form to delete the current list
		*/
		
		displayDeleteForm: function (formElement, liElement) {
		
			formElement.dataset.list = liElement.dataset.guid;
			
			IoC.Mediator.publish('popup.display', [formElement]);
		
		},
		
		/**
			* Hide the form to delete the current list
		*/
		
		hideDeleteForm: function (formElement) {
		
			IoC.Mediator.publish('popup.hide', [formElement]);
		
		},
		
		/**
			* Delete a list from the sidebar
		*/
		
		delete: function (formElement) {
		
			var self = App.View.Wrapper,
				guid = formElement.dataset.list,
				list = self.sidebar.querySelector('.list[data-guid="' + guid + '"]'),
				first = self.sidebar.querySelector('.list:not(.selected)');
			
			list.parentNode.removeChild(list);
			
			self.list.hideDeleteForm(formElement);
			
			IoC.Mediator.publish('list.display', [first]);
		
		}
	
	},
	
	todo: {
	
		/**
			* Display the list of todos
		*/
		
		fillAll: function (todos) {
		
			var self = App.View.Wrapper,
				html = '',
				dones = [];
			
			for (var i = 0, length = todos.length; i < length; i++) {
			
				var revisions = '';
				
				for (var j = 0, l = todos[i].revision.length; j < l; j++) {
				
					revisions += '<li>' + todos[i].revision[j] + '</li>';
				
				}
				
				html += self.templates.todo.innerHTML.replace(/{{guid}}/g, todos[i].guid)
													 .replace(/{{sticky}}/g, todos[i].sticky)
													 .replace(/{{task}}/g, todos[i].task)
													 .replace(/{{revisions}}/g, revisions)
													 .replace(/{{done}}/g, todos[i].done);
			
			}
			
			self.todos.list.innerHTML = html;
			
			dones = self.todos.list.querySelectorAll('[data-done="true"] [name="done"]');
			
			for (var i = 0, l = dones.length; i < l; i++) {
			
				dones[i].checked = true;
			
			}
			
			IoC.Mediator.publish('view.todos.filled');
		
		},
		
		/**
			* Add a todo in the list
		*/
		
		add: function (todo) {
		
			var self = App.View.Wrapper,
				html = '';
		
			self.todos.add.value = '';
			
			html = self.templates.todo.innerHTML.replace(/{{guid}}/g, todo.guid)
												.replace(/{{sticky}}/g, todo.sticky)
												.replace(/{{task}}/g, todo.task)
												.replace(/{{revisions}}/g, '')
												.replace(/{{done}}/g, todo.done);
			
			self.todos.list.innerHTML = html + self.todos.list.innerHTML;
		
		},
		
		/**
			* Change the UI to say if a task is done or not
		*/
		
		toggleDone: function (todoGuid) {
		
			var el = App.View.Wrapper.todos.list.querySelector('li[data-guid="' + todoGuid + '"]');
			
			(el.dataset.done === 'true') ? el.dataset.done = 'false' : el.dataset.done = 'true';
		
		},
		
		/**
			* Change the UI to say if a task is sticky or not
		*/
		
		toggleSticky: function (todoGuid) {
		
			var el = App.View.Wrapper.todos.list.querySelector('li[data-guid="' + todoGuid + '"]');
			
			(el.dataset.sticky === 'true') ? el.dataset.sticky = 'false' : el.dataset.sticky = 'true';
		
		},
		
		/**
			* Add an element in the revision list of a todo
		*/
		
		addRevision: function (el) {
		
			var li = '<li>' + el.value + '</li>';
			
			el.value = '';
			
			el.parentNode.insertAdjacentHTML('beforebegin', li);
		
		},
		
		/**
			* Remove a todo from the list
		*/
		
		delete: function (todo) {
		
			var self = App.View.Wrapper,
				li = self.todos.list.querySelector('li[data-guid="' + todo.guid + '"]');
			
			//verification here because this method will be called when a workspace is destroyed
			if (li !== null) {
			
				self.todos.list.removeChild(li);
			
			}
		
		},
		
		/**
			* Display a todo note popup
		*/
		
		displayNote: function (formElement, todo) {
		
			formElement.querySelector('.txta').value = todo.note;
			formElement.dataset.guid = todo.guid;
			
			IoC.Mediator.publish('popup.display', [formElement]);
		
		},
		
		/**
			* Hide a todo note popup
		*/
		
		hideNote: function (formElement) {
		
			IoC.Mediator.publish('popup.hide', [formElement]);
		
		}
	
	},
	
	note: {
	
		/**
			* Display the list of notes in the sidebar and select the first one
		*/
		
		fillAll: function (notes) {
		
			var self = App.View.Wrapper;
			
			if (notes.length === 0) {
			
				self.note.wrapper.dataset.guid = '';
				return;
			
			}
			
			var html = '',
				firstEl = null;
			
			for (var i = 0, length = notes.length; i < length; i++) {
			
				html += self.templates.note.innerHTML.replace(/{{guid}}/g, notes[i].guid)
													 .replace(/{{text}}/g, notes[i].text.substr(0, 42));
			
			}
			
			self.note.wrapper.dataset.guid = notes[0].guid;
			
			self.sidebar.innerHTML = html;
			
			self.note.txta.value = notes[0].text;
			
			firstEl = self.sidebar.querySelector('li:first-child');
			firstEl.classList.add('selected');
			
			IoC.Mediator.publish('view.notes.filled');
		
		},
		
		/**
			* Add a note in the sidebar
		*/
		
		fill: function (note) {
		
			var self = App.View.Wrapper,
				html = '',
				selected = null,
				last = null;
			
			self.note.wrapper.dataset.guid = note.guid;
			
			html = self.templates.note.innerHTML.replace(/{{guid}}/g, note.guid)
												.replace(/{{text}}/g, note.text.substr(0, 42));
			
			self.sidebar.innerHTML += html;
			
			selected = self.sidebar.querySelector('li.selected');
			last = self.sidebar.querySelector('li:last-child');
			
			if (selected !== null) {
			
				selected.classList.remove('selected');
			
			}
			
			last.classList.add('selected');
			
			self.note.txta.value = note.text;
			
			IoC.Mediator.publish('view.note.filled');
		
		},
		
		/**
			* Change the selected note
		*/
		
		change: function (note, liElement) {
		
			var self = App.View.Wrapper,
				selected = self.sidebar.querySelector('li.selected');
			
			self.note.wrapper.dataset.guid = note.guid;
			
			if (selected !== null) {
			
				selected.classList.remove('selected');
			
			}
			
			liElement.classList.add('selected');
			
			self.note.txta.value = note.text;
			
			IoC.Mediator.publish('note.changed', [note]);
		
		},
		
		/**
			* Delete a note from the sidebar
		*/
		
		delete: function (note) {
		
			var self = App.View.Wrapper,
				li = self.sidebar.querySelector('li[data-guid="' + note.guid + '"]'),
				first = self.sidebar.querySelector('li:not(.selected)');
			
			//verification here because this method will be called when a workspace is destroyed
			if (li !== null) {
			
				self.sidebar.removeChild(li);
			
			}
			
			if (first !== null) {
			
				IoC.Mediator.publish('note.request.display', [first]);
			
			} else {
			
				self.note.wrapper.dataset.guid = '';
				self.note.txta.value = '';
			
			}
		
		},
		
		/**
			* Update the name of the note in the sidebar when this one is saved
		*/
		
		update: function (note) {
		
			var li = App.View.Wrapper.sidebar.querySelector('li[data-guid="' + note.guid + '"]');
			
			if (li !== null) {
			
				li.querySelector('.text')[innerTextProperty] = note.text.substr(0, 42);
			
			}
		
		}
	
	}

};

App.View.Wrapper.initSubscribers();