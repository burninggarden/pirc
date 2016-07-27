var req = require('req');

var
	MessageParser          = req('/lib/client/message-parser'),
	ServerConnectionEvents = req('/lib/client/server-connection/constants/events');

module.exports = {

	init() {
		// Deliberately a noop for the time being.
	},

	handleIncomingMessage(message) {
		console.log('<< ' + message.replace('\n', ''));

		var parsed_message = MessageParser.parse(message);

		this.emit(ServerConnectionEvents.INCOMING_MESSAGE, parsed_message);
	}

};
