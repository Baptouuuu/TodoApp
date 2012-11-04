/**
	* Stock all workspaces
	* It manipulates them depending on application events
*/

var App = App || {};

App.Collection = App.Collection || {};

App.Collection.Workspaces = {

	items: [],
	
	/**
		* Subscribe to needed application events
	*/
	
	initSubscribers: function () {
	
		IoC.Mediator.subscribe('model.workspaces.getAll', this.getAll, this);
		IoC.Mediator.subscribe('model.workspaces.add', this.create, this);
		IoC.Mediator.subscribe('workspace.request.delete.submit', this.delete, this);
	
	},
	
	/**
		* Create a new workspace and add it to the collection
	*/
	
	create: function (workspaceName) {
	
		var workspace = new App.Model.Workspace({
			name: workspaceName
		});
		
		workspace.create();
		
		this.items.push(workspace);
	
	},
	
	/**
		* Retrieves all workspaces
	*/
	
	getAll: function () {
	
		App.Lib.Storage.readAll(
			'workspaces',
			function (event) {
				
				var result = event.target.result,
					workspace = new App.Model.Workspace();
				
				if (!!result === false) {
				
					IoC.Mediator.publish('workspaces.retrieved', [this.items]);
					
					return;
				
				}
				
				workspace.guid = result.value.guid;
				workspace.name = result.value.name;
				
				this.items.push(workspace);
				result.continue();
				
			},
			function (event) {
			
				IoC.Mediator.publish('retrieve.error');
			
			},
			this
		);
	
	},
	
	/**
		* Delete a workspace from the collection and database when the user submit the delete form
	*/
	
	delete: function (formElement) {
	
		var guid = formElement.dataset.workspace;
		
		for (var i = 0, l = this.items.length; i < l; i++) {
		
			if (this.items[i].guid == guid) {
			
				this.items[i].destroy();
				this.items.splice(i, 1);
				
				break;
			
			}
		
		}
	
	}

};

App.Collection.Workspaces.initSubscribers();