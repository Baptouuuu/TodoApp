var App = App || {};

App.Lib = App.Lib || {};

App.Lib.Mediator = {

	channels: {},
	
	/**
		* Channel object to be instanciated every time a new channel is created
	*/
	
	Channel: function (name){
	
		this.name = name || '';
		this.subscribers = {};
		this.stopped = false;
	
	},
	
	/**
		* Add a subscriber to a channel
	*/
	
	subscribe: function (channel, fn, context) {
	
		if (this.channels[channel] === undefined) {
		
			this.channels[channel] = new this.Channel(channel);
		
		}
		
		return this.channels[channel].add(fn, context);
	
	},
	
	/**
		* Remove an element of a channel subscribers list
	*/
	
	remove: function (channel, id) {
	
		if (this.channels[channel] === undefined) {
		
			return;
		
		}
		
		this.channels[channel].remove(id);
	
	},
	
	/**
		* Publish a channel
	*/
	
	publish: function (channel, args) {
	
		if (this.channels[channel] === undefined) {
		
			return;
		
		}
		
		this.channels[channel].publish(args);
	
	},
	
	/**
		* Pause a channel from being fired
	*/
	
	pause: function (channel) {
	
		if (this.channels[channel] === undefined) {
		
			return;
		
		}
		
		this.channels[channel].stopped = true;
	
	},
	
	/**
		* Unpause a channel from being fired
	*/
	
	unpause: function (channel) {
	
		if (this.channels[channel] === undefined) {
		
			return;
		
		}
		
		this.channels[channel].stopped = false;
	
	},
	
	/**
		* Say if a channel is paused or not
	*/
	
	paused: function (channel) {
	
		if (this.channels[channel] === undefined) {
		
			return;
		
		}
		
		return this.channels[channel].stopped;
	
	}

};

/**
	* Channel object prototype
*/

App.Lib.Mediator.Channel.prototype = {

	/**
		* Add a subscriber to the channel
	*/
	
	add: function (fn, context) {
	
		var guid = this.generateGuid();
		
		this.subscribers[guid] = {
			fn: fn,
			context: context || window
		};
		
		return guid;
	
	},
	
	/**
		* Remove an element of the subscribers list
	*/
	
	remove: function (id) {
	
		delete this.subscribers[id];
	
	},
	
	/**
		* Generate a unique identifier for a subscriber
	*/
	
	generateGuid: function () {
	
		return (Math.random() * 100000).toString().substr(0, 5)+'_'+Date.now().toString();
	
	},
	
	/**
		* Call every subscribers function when a channel is published
	*/
	
	publish: function (args) {
	
		if (this.stopped === false) {
		
			for (var s in this.subscribers) {
			
				this.subscribers[s].fn.apply(this.subscribers[s].context, args);
			
			}
		
		}
	
	}

};