var req = require('req');

var
	defer  = req('/utilities/defer'),
	extend = req('/utilities/extend');

var
	ServerConnection = req('/lib/server-connection'),
	NoServerError    = req('/lib/errors/no-server');

class Client {

	constructor() {
		this.servers = [ ];
	}

	connectToServer(parameters, callback) {
		try {
			let server = new ServerConnection(parameters);

			this.servers.push(server);

			return server.connect(callback);
		} catch (error) {
			return void defer(callback, error);
		}
	}

	hasNoServers() {
		return this.servers.length === 0;
	}

	joinChannel(channel, callback) {
		if (this.hasNoServers()) {
			return void defer(callback, new NoServerError(channel));
		}

		return this.getCurrentServer().joinChannel(channel, callback);
	}

	leaveChannel(channel, callback) {
		if (this.hasNoServers()) {
			return void defer(callback, new NoServerError(channel));
		}

		return this.getCurrentServer().leaveChannel(channel, callback);
	}

}

extend(Client.prototype, {
	servers: null
});

module.exports = Client;
