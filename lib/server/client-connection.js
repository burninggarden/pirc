var req = require('req');

var
	EventEmitter           = require('events').EventEmitter,
	ClientConnectionEvents = req('/lib/server/client-connection/constants/events'),
	MessageParser          = req('/lib/server/message-parser');

var
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');


class ClientConnection extends EventEmitter {

	constructor(socket) {
		super();

		this.socket = socket;
		this.bindHandlers();
		this.bindToSocket();
	}

	bindHandlers() {
		this.handleSocketData = this.handleSocketData.bind(this);
		this.handleSocketError = this.handleSocketError.bind(this);
		this.handleSocketClose = this.handleSocketClose.bind(this);
	}

	bindToSocket() {
		this.socket.on('data', this.handleSocketData);
		this.socket.on('error', this.handleSocketError);
		this.socket.on('close', this.handleSocketClose);
	}

	handleSocketData(data) {
		var messages = data.toString('utf8').split('\r\n');

		messages.forEach(this.handleIncomingMessage, this);
	}

	handleIncomingMessage(message_string) {
		var message = MessageParser.parse(message_string);

		this.emit(ClientConnectionEvents.INCOMING_MESSAGE, message);
	}

	handleSocketError(error) {
		throw new NotYetImplementedError();
	}

	handleSocketClose() {
		throw new NotYetImplementedError();
	}

}

module.exports = ClientConnection;
