var App = App || {};

App.Index = {

	init: function () {
	
		var self = App.Index;
		
		console.log('Testing the browser for supporting all features...');
		
		IoC.Mediator.publish('app.testBrowser');
		
		if (!IoC.Mediator.paused('app.init')) {
		
			console.log('App initializing...');
			
			IoC.Mediator.publish('app.init');
			
			//prevent another script to re-init the app
			IoC.Mediator.pause('app.init');
			
			console.log('App initialized!');
		
		} else {
		
			IoC.Mediator.publish('app.browserIncompatible');
		
		}
	
	},
	
	testBrowser: function () {
	
		if (window.localStorage === undefined || document.querySelector === undefined || document.querySelectorAll === undefined || (window.indexedDB === undefined && window.webkitIndexedDB === undefined && window.mozIndexedDB === undefined && window.msIndexedDB === undefined)) {
			
			IoC.Mediator.pause('app.init');
		
		}
		
		//Browser need to support datasets
		var li = document.createElement('li');
		
		if (li.dataset === undefined || li.classList === undefined) {
		
			IoC.Mediator.pause('app.init');
		
		}
	
	}

};

IoC.Mediator.subscribe('app.testBrowser', App.Index.testBrowser, App.Index);

window.addEventListener('load', App.Index.init, false);