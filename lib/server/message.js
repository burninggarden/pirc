var req = require('req');

var
	extend  = req('/utilities/extend'),
	Message = req('/lib/message');


class ServerMessage extends Message {

	isFromServer() {
		return true;
	}

}

extend(ServerMessage.prototype, {
	prefix: null
});

module.exports = ServerMessage;
