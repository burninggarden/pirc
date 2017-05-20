
var
	EventEmitter  = require('events').EventEmitter,
	TextFormatter = req('/lib/utilities/text-formatter'),
	extend        = req('/lib/utilities/extend');


class Connection extends EventEmitter {

	shouldLogOutboundMessages() {
		// return this.log_outbound_messages;
		return true;
	}

	logOutboundMessages() {
		this.log_outbound_messages = true;
	}

	logOutboundMessage(text) {
		text = this.trimRawMessage(text);

		if (text) {
			console.log(TextFormatter.cyan('SEND: ') + text);
		}
	}

	shouldLogInboundMessages() {
		// return this.log_inbound_messages;
		return true;
	}

	logInboundMessages() {
		this.log_inbound_messages = true;
	}

	logInboundMessage(text) {
		text = this.trimRawMessage(text);

		if (text) {
			console.log(TextFormatter.yellow('RECV: ') + text);
		}
	}

	trimRawMessage(text) {
		text = text.replace(/\n/g, '');
		text = text.trim();

		return text;
	}

}

extend(Connection.prototype, {

	socket:                null,

	log_inbound_messages:  false,
	log_outbound_messages: false

});

module.exports = Connection;
