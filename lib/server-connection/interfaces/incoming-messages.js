var req = require('req');

var MessageParser = req('/lib/message-parser');

module.exports = {

	handleIncomingMessage(message) {
		var message = MessageParser.parse(message);

		this.emit('message', message);
	}

};
