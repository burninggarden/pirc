
var
	EventEmitter = require('events').EventEmitter,
	extend       = req('/utilities/extend');

class Connection extends EventEmitter {

	shouldLogOutboundMessages() {
		return this.log_outbound_messages;
	}

	logOutboundMessages() {
		this.log_outbound_messages = true;
	}

	logOutboundMessage(text) {
		console.log('>> ' + text);
	}

	shouldLogInboundMessages() {
		return this.log_inbound_messages;
	}

	logInboundMessages() {
		this.log_inbound_messages = true;
	}

	logInboundMessage(text) {
		console.log('<< ' + text);
	}

}

extend(Connection.prototype, {

	log_inbound_messages:  false,
	log_outbound_messages: false

});

module.exports = Connection;
