
var req = require('req');

var Message = req('/lib/message');

class ClientMessage extends Message {

	/**
	 * Override the base "isFromClient()" method on the parent message class,
	 * for obvious reasons...
	 *
	 * @returns {boolean}
	 */
	isFromClient() {
		return true;
	}

	shouldOmitPrefix() {
		return true;
	}

}

module.exports = ClientMessage;
