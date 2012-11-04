/**
	* Handles DOM events of the content wrapper
	* And dispatch appropriate application events
*/

var App = App || {};

App.Controller = App.Controller || {};

App.Controller.Wrapper = {

	block: null,
	typeSelectors: null,
	workspaces: {
		deleteButton: null,
		deleteForm: null
	},
	sidebar: {
		list: null,
		add: null
	},
	todos: {
		add: null,
		list: null,
		noteForm: null
	},
	note: null,
	lists: {
		newForm: null,
		deleteForm: null
	},
	
	/**
		* Subscribe to needed application events
	*/
	
	initSubscribers: function () {
	
		IoC.Mediator.subscribe('view.wrapper.inited', this.init, this);
	
	},
	
	/**
		* Add DOM events and notify the app it can retrieve lists for the current workspace
	*/
	
	init: function () {
	
		var self = this;
		
		self.block = document.body.querySelector('#wrapper');
		self.typeSelectors = self.block.querySelector('#type_selectors');
		
		self.workspaces.deleteButton = self.block.querySelector('#workspace_delete');
		self.workspaces.deleteForm = document.body.querySelector('#delete_workspace');
		
		self.sidebar.list = self.block.querySelector('#wc_list > ul');
		self.sidebar.add = self.block.querySelector('#wcl_add');
		
		self.todos.add = self.block.querySelector('#wcc_todos > .input');
		self.todos.list = self.block.querySelector('#wcc_todos > ul');
		self.todos.noteForm = document.body.querySelector('#todo_note');
		
		self.note = self.block.querySelector('#wcc_note');
		
		self.lists.newForm = document.body.querySelector('#new_list');
		self.lists.deleteForm = document.body.querySelector('#delete_list');
		
		
		
		self.typeSelectors.addEventListener(
			'click', 
			function (event) {
			
				var el = event.target;
				
				//notify the app we change the type of content to display
				if(el.classList.contains('type_selector')){
				
					IoC.Mediator.publish('wrapper.change.type', [el.dataset.type, self.block.dataset.workspace]);
				
				}
			
			},
			false
		);
		
		self.workspaces.deleteButton.addEventListener(
			'click', 
			function (event) {
			
				//notify the app the user want to delete the current workspace (first workspace can't be deleted)
				if (self.block.dataset.workspace != 1) {
				
					IoC.Mediator.publish('workspace.request.delete', [self.workspaces.deleteForm]);
				
				}
			
			}, 
			false
		);
		
		self.sidebar.list.addEventListener(
			'click', 
			function (event) {
			
				var el = event.target;
				
				if (self.block.dataset.type === 'tasks') {
				
					//the user want to delete the current list
					if (el.classList.contains('delete') && el.parentNode.classList.contains('list') && el.parentNode.classList.contains('selected')) {
					
						IoC.Mediator.publish('list.request.delete', [self.lists.deleteForm, el.parentNode]);
					
					//the user want to display an other list
					} else if (el.nodeName === 'LI' && el.classList.contains('list') && !el.classList.contains('selected')) {
					
						IoC.Mediator.publish('list.display', [el]);
					
					//the user want to display an other list
					} else if (!el.parentNode.classList.contains('selected')) {
					
						IoC.Mediator.publish('list.display', [el.parentNode]);
					
					}
				
				} else if (self.block.dataset.type === 'notes') {
				
					//the user want to delete the current note
					if (el.classList.contains('delete') && el.parentNode.classList.contains('note') && el.parentNode.classList.contains('selected')) {
					
						IoC.Mediator.publish('note.request.delete', [el.parentNode]);
					
					//the user want to display an other note
					} else if (el.nodeName === 'LI' && el.classList.contains('note') && !el.classList.contains('selected')) {
					
						IoC.Mediator.publish('note.request.display', [el]);
					
					//the user want to display an other note
					} else if (!el.parentNode.classList.contains('selected')) {
					
						IoC.Mediator.publish('note.request.display', [el.parentNode]);
					
					}
				
				}
			
			}, 
			false
		);
		
		self.sidebar.add.addEventListener(
			'click', 
			function (event) {
			
				var type = self.block.dataset.type;
				
				//the user want to create a new list
				if (type === 'tasks') {
				
					IoC.Mediator.publish('todo.request.new', [self.lists.newForm]);
				
				//the user want to create a new note
				} else if (type === 'notes') {
				
					IoC.Mediator.publish('note.request.new', [self.block.dataset.workspace]);
				
				}
			
			}, 
			false
		);
		
		self.todos.add.addEventListener(
			'keypress', 
			function (event) {
			
				//the user pressed enter to add a new todo
				if (event.keyCode === 13 && event.target.checkValidity()) {
				
					IoC.Mediator.publish('model.todo.add', [self.todos.add]);
				
				}
			
			}, 
			false
		);
		
		self.todos.list.addEventListener(
			'click', 
			function (event) {
			
				var el = event.target;
				
				//the user want to mark a todo as done
				if (el.nodeName === 'INPUT' && el.name === 'done') {
				
					IoC.Mediator.publish('todo.done.toggle', [el.dataset.guid]);
				
				//the user want to mark a todo as sticky
				} else if (el.nodeName === 'SPAN' && el.classList.contains('sticky')) {
				
					IoC.Mediator.publish('todo.sticky.toggle', [el.dataset.guid]);
				
				//the user want to delete a task
				} else if (el.nodeName === 'SPAN' && el.classList.contains('delete')) {
				
					IoC.Mediator.publish('todo.delete', [el.dataset.guid]);
				
				//the user want to display the note of a todo
				} else if (el.nodeName === 'SPAN' && el.classList.contains('note')) {
				
					IoC.Mediator.publish('todo.note.request.display', [self.todos.noteForm, el.dataset.guid]);
				
				}
			
			}, 
			false
		);
		
		self.todos.list.addEventListener(
			'keypress', 
			function (event) {
			
				//the user pressed enter to add a new revision for a todo
				if (event.keyCode === 13) {
				
					IoC.Mediator.publish('todo.revision.add', [event.target]);
				
				}
			
			}, 
			false
		);
		
		self.note.addEventListener(
			'click', 
			function (event) {
			
				var el = event.target,
					txta = self.note.querySelector('.txta');
				
				//the user want to save the note
				if (el.nodeName === 'INPUT' && el.name === 'save_note') {
				
					IoC.Mediator.publish('note.update', [self.note.dataset.guid, txta.value]);
				
				}
			
			},
			false
		);
		
		self.workspaces.deleteForm.addEventListener(
			'click',
			function (event) {
			
				var node = event.target;
				
				//the user aborted the form to delete the current workspace
				if ((node.nodeName === 'SPAN' && node.classList.contains('close')) || (node.nodeName === 'DIV' && node.classList.contains('background')) || (node.nodeName === 'INPUT' && node.name === 'cancel_delete_workspace')) {
				
					IoC.Mediator.publish('workspace.request.delete.canceled', [self.workspaces.deleteForm]);
				
				//the user submitted the form to delete the workspace
				} else if (node.nodeName === 'INPUT' && node.name === 'delete_workspace') {
				
					IoC.Mediator.publish('workspace.request.delete.submit', [self.workspaces.deleteForm]);
				
				}
			
			},
			false
		);
		
		self.lists.newForm.addEventListener(
			'click', 
			function (event) {
			
				var node = event.target;
				
				//the user aborted the form to add a new list
				if ((node.nodeName === 'SPAN' && node.classList.contains('close')) || (node.nodeName === 'DIV' && node.classList.contains('background'))) {
				
					IoC.Mediator.publish('list.request.new.canceled', [self.lists.newForm]);
				
				//the user submitted the form to add a new list
				} else if (node.nodeName === 'INPUT' && node.name === 'add_list') {
				
					IoC.Mediator.publish('list.request.new.submit', [self.lists.newForm]);
				
				}
			
			}, 
			false
		);
		
		self.lists.deleteForm.addEventListener(
			'click', 
			function (event) {
			
				var node = event.target;
				
				//the user aborted the form to delete a list
				if ((node.nodeName === 'SPAN' && node.classList.contains('close')) || (node.nodeName === 'DIV' && node.classList.contains('background')) || (node.nodeName === 'INPUT' && node.name === 'cancel_delete_list')) {
				
					IoC.Mediator.publish('list.request.delete.canceled', [self.lists.deleteForm]);
				
				//the user submitted the form to delete a list
				} else if (node.nodeName === 'INPUT' && node.name === 'delete_list') {
				
					IoC.Mediator.publish('list.request.delete.submit', [self.lists.deleteForm]);
				
				}
			
			}, 
			false
		);
		
		self.todos.noteForm.addEventListener(
			'click', 
			function (event) {
			
				var node = event.target;
				
				//the user don't want to save the todo note
				if ((node.nodeName === 'SPAN' && node.classList.contains('close')) || (node.nodeName === 'DIV' && node.classList.contains('background'))) {
				
					IoC.Mediator.publish('todo.note.hide', [self.todos.noteForm]);
				
				//the user want to save the todo note
				} else if (node.nodeName === 'INPUT' && node.name === 'save_note') {
				
					IoC.Mediator.publish('todo.note.save', [self.todos.noteForm]);
				
				}
			
			}, 
			false
		);
		
		console.log('Wrapper Controller initialized!');
		
		IoC.Mediator.publish('model.lists.getAll', [self.block.dataset.workspace]);
	
	}

};

App.Controller.Wrapper.initSubscribers();