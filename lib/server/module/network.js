
var
	extend           = require('../../utility/extend'),
	Server_Module    = require('../module'),
	Enum_ModuleTypes = require('../../enum/module-types');


class Server_Module_Network extends Server_Module {

	registerServer(server, callback) {
		this.authenticateServer(server, callback);
	}

	authenticateServer(server, callback) {
		if (!this.hasAuthenticationCallback()) {
			let error = new Error('No server auth mechanism set');

			this.sendErrorToConnection(error, server);

			return void callback(error);
		}

		var
			remote_server_details = server.getRemoteServerDetails(),
			auth_callback         = this.getAuthenticationCallback();

		var parameters = {
			hostname: remote_server_details.getHostname(),
			password: remote_server_details.getPassword()
		};

		function handler(error) {
			if (error) {
				this.handleServerAuthenticationError(server, error);
			} else {
				this.handleServerAuthenticationSuccess(server);
			}

			return void callback(error);
		}

		auth_callback(parameters, handler.bind(this));
	}

	handleServerAuthenticationError(server, error) {
		this.sendErrorToConnection(error, server);
	}

	handleServerAuthenticationSuccess(server) {
		if (!server.hasSentRegistrationMessages()) {
			server.sendRegistrationMessages();
		}
	}

	handleServerMessage(server, message) {
		var id = server.getId();
		message.raw_message;
		console.log(`HANDLING MESSAGE FROM SERVER ${id}: ${message}`);
	}

	coupleToServer(server) {
		this.sendServerInformationToServer(server);
		this.sendClientInformationToServer(server);
		this.sendChannelInformationToServer(server);
	}

	sendServerInformationToServer(server) {
		this.getServers().forEach(function each(current_server) {
			this.notifyServerOfServer(server, current_server);
		}, this);
	}

	notifyServerOfServer(server_to_notify, server_in_question) {
		var message = new Message_Command_Server();
	}

	sendClientInformationToServer(server) {
		this.getClients().forEach(function each(client) {
			this.notifyServerOfClient(server, client);
		}, this);
	}

	notifyServerOfClient(server, client) {
	}

	sendChannelInformationToServer(server) {
		this.getChannels().forEach(function each(channel) {
			this.notifyServerOfChannel(server, channel);
		}, this);
	}

	notifyServerOfChannel(server, channel) {
	}

}


extend(Server_Module_Network.prototype, {
	type: Enum_ModuleTypes.NETWORK
});

module.exports = Server_Module_Network;
