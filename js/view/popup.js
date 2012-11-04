/**
	* Handles the display of popups
*/

var App = App || {};

App.View = App.View || {};

App.View.Popup = {

	/**
		* Subscribe to needed application events
	*/
	
	initSubscribers: function () {
	
		IoC.Mediator.subscribe('popup.display', this.display, this);
		IoC.Mediator.subscribe('popup.hide', this.hide, this);
	
	},
	
	/**
		* Display the popup passed as parameter
	*/
	
	display: function (popupElement) {
	
		if (!popupElement.classList.contains('opened')) {
		
			popupElement.style.display = 'block';
			setTimeout(function () {popupElement.classList.add('opened')}, 0);
		
		}
	
	},
	
	/**
		* Hide the popup passed as parameter
	*/
	
	hide: function (popupElement) {
	
		if (popupElement.classList.contains('opened')) {
		
			popupElement.style.display = 'none';
			popupElement.classList.remove('opened');
		
		}
	
	}

};

App.View.Popup.initSubscribers();