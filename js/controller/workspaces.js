/**
	* Handles DOM events of the menu
	* And dispatch appropriate application events
*/

var App = App || {};

App.Controller = App.Controller || {};

App.Controller.Workspaces = {

	block: null,
	list: null,
	newButton: null,
	newForm: null,
	toggleMenu: null,
	
	/**
		* Subscribe to needed application events
	*/
	
	initSubscribers: function () {
	
		IoC.Mediator.subscribe('storage.opened', this.init, this);
	
	},
	
	/**
		* Add DOM events and notify the application it can retrieve all workspaces
		* in order to be displayed
	*/
	
	init: function () {
	
		var self = this;
		
		self.block = document.body.querySelector('#menu');
		self.list = self.block.querySelector('ul');
		self.newButton = self.block.querySelector('#add_workspace');
		self.newForm = document.body.querySelector('#new_workspace');
		self.toggleMenu = self.block.querySelector('#toggle');
		
		self.list.addEventListener(
			'click', 
			function (event) {
				
				//notify the app clicked on a workspace in the menu list
				if (event.target.nodeName === 'LI' && event.target.dataset.guid !== undefined) {
				
					IoC.Mediator.publish('workspace.display', [event.target.dataset.guid, event.target.dataset.name]);
				
				}
			
			}, 
			false
		);
		
		self.newButton.addEventListener(
			'click', 
			function (event) {
			
				//notify the app the user want to add a new workspace
				IoC.Mediator.publish('workspace.request.new', [self.newForm]);
			
			}, 
			false
		);
		
		self.toggleMenu.addEventListener(
			'click', 
			function (event) {
			
				//notify the app to open/close the menu
				IoC.Mediator.publish('menu.toggle');
			
			}, 
			false
		);
		
		self.newForm.addEventListener(
			'click', 
			function (event) {
				
				var node = event.target;
				
				//notify the app the user aborted the form to add a new workspace
				if ((node.nodeName === 'SPAN' && node.classList.contains('close')) || (node.nodeName === 'DIV' && node.classList.contains('background'))) {
				
					IoC.Mediator.publish('workspace.request.new.canceled', [self.newForm]);
				
				//notify the app the user submitted the form to add a new workspace
				} else if (node.nodeName === 'INPUT' && node.classList.contains('button')) {
				
					IoC.Mediator.publish('workspace.request.new.submit', [self.newForm]);
				
				}
			
			},
			false
		);
		
		console.log('Workspaces Controller initialized!');
		
		IoC.Mediator.publish('model.workspaces.getAll');
	
	}

};

App.Controller.Workspaces.initSubscribers();