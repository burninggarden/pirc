var req = require('req');

var
	MessageParser          = req('/lib/client/message-parser'),
	ServerConnectionEvents = req('/lib/client/server-connection/constants/events');

module.exports = {

	handleIncomingMessage(message) {
		var message = MessageParser.parse(message);

		this.emit(ServerConnectionEvents.INCOMING_MESSAGE, message);
	}

};
