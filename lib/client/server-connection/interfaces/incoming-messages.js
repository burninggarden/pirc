var req = require('req');

var
	MessageParser          = req('/lib/client/message-parser'),
	ServerConnectionEvents = req('/lib/client/server-connection/constants/events');

module.exports = {

	init() {
		// Deliberately a noop for the time being.
	},

	handleIncomingMessage(message) {
		var parsed_message = MessageParser.parse(message);

		if (parsed_message !== null) {
			console.log('<< ' + message.replace('\n', ''));
			this.handleMessage(parsed_message);
		}
	}

};
