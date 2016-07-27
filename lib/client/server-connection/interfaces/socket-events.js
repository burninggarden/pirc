var req = require('req');

var
	ServerConnectionEvents = req('/lib/client/server-connection/constants/events');


module.exports = {

	init() {
		this.bindHandlers();
	},

	bindHandlers() {
		this.handleSocketData    = this.handleSocketData.bind(this);
		this.handleSocketConnect = this.handleSocketConnect.bind(this);
		this.handleSocketError   = this.handleSocketError.bind(this);
		this.handleSocketEnd     = this.handleSocketEnd.bind(this);
		this.handleSocketClose   = this.handleSocketClose.bind(this);
	},

	handleSocketData(data) {
		var messages = data.toString('utf8').split('\r\n');

		messages.forEach(this.handleIncomingMessage, this);
	},

	handleSocketConnect() {
		this.connected = true;

		this.emit(ServerConnectionEvents.CONNECTION_SUCCESS);
	},

	handleSocketError(error) {
		if (!this.connected) {
			this.emit(ServerConnectionEvents.CONNECTION_FAILURE);
		}
	},

	handleSocketEnd() {
		this.unbindSocketEvents();

		this.emit(ServerConnectionEvents.CONNECTION_END);
	},

	handleSocketClose() {
		throw new Error('implement');
	},

	bindSocketEvents() {
		this.socket.on('data',    this.handleSocketData);
		this.socket.on('connect', this.handleSocketConnect);
		this.socket.on('error',   this.handleSocketError);
		this.socket.on('end',     this.handleSocketEnd);
		this.socket.on('close',   this.handleSocketClose);
	},

	unbindSocketEvents() {
		this.socket.removeListener('data',    this.handleSocketData);
		this.socket.removeListener('connect', this.handleSocketConnect);
		this.socket.removeListener('error',   this.handleSocketError);
		this.socket.removeListener('end',     this.handleSocketEnd);
		this.socket.removeListener('close',   this.handleSocketClose);
	}

};
