/**
	* Handles UI of the menu
*/

var App = App || {};

App.View = App.View || {};

App.View.Workspaces = {

	templates: {
		menu: null,
		newForm: null
	},
	block: null,
	
	/**
		* Display the popup passed as parameter
	*/
	
	initSubscribers: function () {
	
		IoC.Mediator.subscribe('app.init', this.init, this);
		IoC.Mediator.subscribe('workspaces.retrieved', this.fillWorkspaces, this);
		IoC.Mediator.subscribe('workspace.request.new', this.displayNewForm, this);
		IoC.Mediator.subscribe('workspace.request.new.canceled', this.hideNewForm, this);
		IoC.Mediator.subscribe('workspace.request.new.submit', this.addWorkspace, this);
		IoC.Mediator.subscribe('menu.toggle', this.toggleMenu, this);
		IoC.Mediator.subscribe('workspace.display', this.toggleMenu, this);
		IoC.Mediator.subscribe('model.workspace.created', this.fillWorkspace, this);
		IoC.Mediator.subscribe('workspace.request.delete.submit', this.deleteWorkspace, this);
	
	},
	
	/**
		* Retrieve templates and display them
	*/
	
	init: function () {
	
		this.templates.menu = document.body.querySelector('#tpl_menu');
		this.templates.newForm = document.body.querySelector('#tpl_workspace_new_form');
		
		document.body.innerHTML = this.templates.menu.innerHTML + this.templates.newForm.innerHTML + document.body.innerHTML;
		
		this.block = document.querySelector('#menu');
		this.list = this.block.querySelector('ul');
		
		console.log('Menu View initialized!');
		
		IoC.Mediator.publish('view.workspaces.inited');
	
	},
	
	/**
		* Display all workspaces in the list
	*/
	
	fillWorkspaces: function (workspaces) {
	
		var ul = this.block.querySelector('ul');
		
		ul.innerHTML = '';
		
		for (var i = 0, l = workspaces.length; i < l; i++) {
		
			var li = document.createElement('li');
			
			li.dataset.guid = workspaces[i].guid;
			li.dataset.name = workspaces[i].name;
			li.textContent = workspaces[i].name;
			
			ul.appendChild(li);
		
		}
		
		IoC.Mediator.publish('menu.workspaces.added');
	
	},
	
	/**
		* Display the form to add a new workspace
	*/
	
	displayNewForm: function (formElement) {
	
		IoC.Mediator.publish('popup.display', [formElement]);
		
		//focus not working before displaying the popup because it's hidden
		formElement.querySelector('.input').focus();
	
	},
	
	/**
		* Hide the form to add a new workspace
	*/
	
	hideNewForm: function (formElement) {
	
		var input = formElement.querySelector('.input[name="new_workspace_name"]');
		
		input.value = '';
		input.classList.remove('error');
		
		IoC.Mediator.publish('popup.hide', [formElement]);
	
	},
	
	/**
		* Open/close the menu
	*/
	
	toggleMenu: function () {
	
		this.block.classList.toggle('opened');
	
	},
	
	/**
		* Hide the form to add a workspace and notify the app to create a new workspace in the database
		* (will be used by the workspaces collection)
	*/
	
	addWorkspace: function (formElement) {
	
		var input = formElement.querySelector('.input[name="new_workspace_name"]');
		
		if (input.checkValidity()) {
		
			var value = input.value;
			
			this.hideNewForm(formElement);
			
			IoC.Mediator.publish('model.workspaces.add', [value]);
		
		} else {
		
			input.classList.add('error');
		
		}
	
	},
	
	/**
		* Add the new workspace created to the list in the menu
	*/
	
	fillWorkspace: function (workspace) {
	
		var li = document.createElement('li');
		
		li.dataset.guid = workspace.guid;
		li.dataset.name = workspace.name;
		li.textContent = workspace.name;
		
		this.block.querySelector('ul').appendChild(li);
		
		this.toggleMenu();
		
		IoC.Mediator.publish('menu.workspace.added', [workspace]);
	
	},
	
	/**
		* Remove a workspace from the list in the menu and notify the app to display the first one
	*/
	
	deleteWorkspace: function (formElement) {
	
		var guid = formElement.dataset.workspace,
			workspace = this.block.querySelector('#workspaces li[data-guid="' + guid +'"]'),
			first = this.block.querySelector('#workspaces li:first-child');
		
		workspace.parentNode.removeChild(workspace);
		
		IoC.Mediator.publish('workspace.display', [first.dataset.guid, first.dataset.name]);
	
	}

};

App.View.Workspaces.initSubscribers();