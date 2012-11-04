/**
	* Handles UI when the browser is not supported
*/

var App = App || {};

App.View = App.View || {};

App.View.Browser = {

	templateIncomp: null,
	
	/**
		* Subscribe to needed application events
	*/
	
	initSubscribers: function () {
	
		IoC.Mediator.subscribe('app.browserIncompatible', this.displayIncompatibility, this);
	
	},
	
	/**
		* Display a specific template when the browser do not support all required features
	*/
	
	displayIncompatibility: function () {
	
		this.templateIncomp = document.body.querySelector('#tpl_browser_incompatible');
		
		document.body.innerHTML = this.templateIncomp.innerHTML + document.body.innerHTML;
	
	}

};

App.View.Browser.initSubscribers();