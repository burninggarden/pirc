var req = require('req');

var
	extend                 = req('/utilities/extend'),
	EventEmitter           = require('events').EventEmitter,
	ClientConnectionEvents = req('/lib/server/client-connection/constants/events'),
	MessageParser          = req('/lib/server/message-parser'),
	CharacterClasses       = req('/constants/character-classes');

var
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');


var ID = 0;


class ClientConnection extends EventEmitter {

	constructor(socket) {
		super();

		this.id = ID++;

		this.modes = [ ];

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

		if (message !== null) {
			this.emit(ClientConnectionEvents.INCOMING_MESSAGE, message);
		}
	}

	handleSocketError(error) {
		throw new NotYetImplementedError();
	}

	handleSocketClose() {
		this.emit(ClientConnectionEvents.CONNECTION_END);
	}

	sendMessage(message) {
		this.socket.write(message.serialize() + CharacterClasses.MESSAGE_SUFFIX);
	}

	getId() {
		return this.id;
	}

	getNick() {
		return this.nick;
	}

	setNick(nick) {
		this.nick = nick;
		return this;
	}

	getUsername() {
		return this.username;
	}

	setUsername(username) {
		this.username = username;
		return this;
	}

	getRealname() {
		return this.realname;
	}

	setRealname(realname) {
		this.realname = realname;
		return this;
	}

	addMode(mode) {
		this.modes.push(mode);
		return this;
	}

	isServer() {
		// Eventually we want to support servers-as-clients. Sigh.
		// TODO: Actually wire this up.
		return false;
	}

	destroy() {
		this.socket.destroy();
	}

}

extend(ClientConnection.prototype, {

	nick:     null,
	username: null,
	realname: null,
	modes:    null

});

module.exports = ClientConnection;
