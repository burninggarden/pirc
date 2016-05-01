var req = require('req');

var
	ServerConnectionEvents = req('/constants/server-connection-events');


module.exports = {

	bindHandlers() {
		this.handleSocketData = this.handleSocketData.bind(this);
		this.handleSocketConnect = this.handleSocketConnect.bind(this);
		this.handleSocketError = this.handleSocketError.bind(this);
		this.handleSocketEnd = this.handleSocketEnd.bind(this);
		this.handleSocketClose = this.handleSocketClose.bind(this);
	},

	handleSocketData(data) {
		var messages = data.toString('utf8').split('\r\n');

		messages.forEach(this.handleIncomingMessage, this);
	},

	handleSocketConnect() {
		this.connected = true;

		this.sendRegistrationMessages();
	},

	handleSocketError(error) {
		if (!this.connected) {
			this.emit(ServerConnectionEvents.CONNECTION_FAILURE);
		}
	},

	handleSocketEnd() {
		this.unbindSocketEvents();
	},

	handleSocketClose() {
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
