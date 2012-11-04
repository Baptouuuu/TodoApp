/**
	* Stock all lists of the current workspace
	* It manipulates them depending on application events
*/

var App = App || {};

App.Collection = App.Collection || {};

App.Collection.Lists = {

	items: [],
	
	/**
		* Subscribe to needed application events
	*/
	
	initSubscribers: function () {
	
		IoC.Mediator.subscribe('model.workspace.created', this.createDefault, this);
		IoC.Mediator.subscribe('model.lists.getAll', this.getAll, this);
		IoC.Mediator.subscribe('wrapper.workspace.changed', this.getAll, this);
		IoC.Mediator.subscribe('wrapper.change.type', this.checkType, this);
		IoC.Mediator.subscribe('model.list.add', this.create, this);
		IoC.Mediator.subscribe('list.request.delete.submit', this.delete, this);
	
	},
	
	/**
		* Create the default list when a workspace is created
	*/
	
	createDefault: function (workspace) {
	
		var list = new App.Model.List({
			name: 'Inbox',
			workspace: parseInt(workspace.guid)
		});
		
		list.create();
		
		this.items.push(list);
	
	},
	
	/**
		* Create a new list when the user submit the form, and add it to the collection
	*/
	
	create: function (listName, workspaceGuid) {
	
		var list = new App.Model.List({
			name: listName,
			workspace: workspaceGuid
		});
		
		list.create();
		
		this.items.push(list);
	
	},
	
	/**
		* Retrieve all lists of the wished workspace
	*/
	
	getAll: function (workspaceGuid, workspaceName) {
	
		this.items = [];
		
		App.Lib.Storage.find(
			'lists',
			'workspace',
			parseInt(workspaceGuid),
			function (event) {
			
				var result = event.target.result,
					list = new App.Model.List();
				
				if (!!result === false) {
				
					IoC.Mediator.publish('lists.retrieved', [this.items]);
					
					return;
				
				}
				
				list.guid = result.value.guid;
				list.name = result.value.name;
				list.workspace = result.value.workspace;
				
				this.items.push(list);
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
		* If tasks it retrieves all lists
	*/
	
	checkType: function (type, workspaceGuid) {
	
		if (type === 'tasks') {
		
			this.getAll(workspaceGuid);
		
		}
	
	},
	
	/**
		* Delete a list from the collection when the user submit the form
	*/
	
	delete: function (formElement) {
	
		var guid = formElement.dataset.list;
		
		for (var i = 0, l = this.items.length; i < l; i++) {
		
			if (this.items[i].guid == guid) {
			
				this.items[i].destroy();
				this.items.splice(i, 1);
				
				break;
			
			}
		
		}
	
	}

};

App.Collection.Lists.initSubscribers();