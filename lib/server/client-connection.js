var
	extend                 = req('/utilities/extend'),
	EventEmitter           = require('events').EventEmitter,
	ClientConnectionEvents = req('/lib/server/client-connection/constants/events'),
	MessageParser          = req('/lib/server/message-parser'),
	TargetTypes            = req('/constants/target-types');

var
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');

var
	NickValidator       = req('/validators/nick'),
	RealnameValidator   = req('/validators/realname'),
	UsernameValidator   = req('/validators/username'),
	ServerNameValidator = req('/validators/server-name'),
	HostnameValidator   = req('/validators/hostname');


var ID = 0;


class ClientConnection extends EventEmitter {

	constructor(socket) {
		super();

		this.id = ID++;

		this.modes = [ ];

		this.socket = socket;

		this.bindHandlers();
		this.bindToSocket();
		this.setHostname(socket.remoteAddress);
	}

	bindHandlers() {
		this.handleSocketData  = this.handleSocketData.bind(this);
		this.handleSocketError = this.handleSocketError.bind(this);
		this.handleSocketClose = this.handleSocketClose.bind(this);
	}

	bindToSocket() {
		this.socket.on('data',  this.handleSocketData);
		this.socket.on('error', this.handleSocketError);
		this.socket.on('close', this.handleSocketClose);
	}

	handleSocketData(data) {
		var messages = data.toString('utf8').split('\r\n');

		messages.forEach(this.handleIncomingMessage, this);
	}

	handleIncomingMessage(message_string) {
		var message;

		try {
			message = MessageParser.parse(message_string);
		} catch (error) {
			this.emit(ClientConnectionEvents.MESSAGE_ERROR, error);
			return;
		}

		if (message === null) {
			return;
		}

		this.emit(ClientConnectionEvents.INCOMING_MESSAGE, message);
	}

	handleSocketError(error) {
		throw new NotYetImplementedError();
	}

	handleSocketClose() {
		this.emit(ClientConnectionEvents.CONNECTION_END);
	}

	sendMessage(message) {
		message.setServerName(this.getServerName());
		this.socket.write(message.serialize());
	}

	getId() {
		return this.id;
	}

	getTargetType() {
		return TargetTypes.CLIENT;
	}

	getTargetString() {
		if (this.hasNick()) {
			return this.getNick();
		} else {
			return this.getAddress();
		}
	}

	hasNick() {
		return this.nick !== null;
	}

	getNick() {
		NickValidator.validate(this.nick);
		return this.nick;
	}

	setNick(nick) {
		NickValidator.validate(nick);
		this.nick = nick;
		return this;
	}

	hasUsername() {
		return this.username !== null;
	}

	getUsername() {
		UsernameValidator.validate(this.username);
		return this.username;
	}

	setUsername(username) {
		UsernameValidator.validate(username);
		this.username = username;
		return this;
	}

	hasRealname() {
		return this.realname !== null;
	}

	getRealname() {
		RealnameValidator.validate(this.realname);
		return this.realname;
	}

	setRealname(realname) {
		RealnameValidator.validate(realname);
		this.realname = realname;
		return this;
	}

	hasServerName() {
		return this.server_name !== null;
	}

	getServerName(server_name) {
		ServerNameValidator.validate(this.server_name);
		return this.server_name;
	}

	setServerName(server_name) {
		ServerNameValidator.validate(server_name);
		this.server_name = server_name;
		return this;
	}

	hasHostname() {
		return this.hostname !== null;
	}

	getHostname() {
		HostnameValidator.validate(this.hostname);
		return this.hostname;
	}

	setHostname(hostname) {
		HostnameValidator.validate(hostname);
		this.hostname = hostname;
		return this;
	}

	getAddress() {
		return this.getUsername() + '@' + this.getHostname();
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

	nick:        null,
	username:    null,
	realname:    null,
	modes:       null,
	server_name: null

});

module.exports = ClientConnection;
