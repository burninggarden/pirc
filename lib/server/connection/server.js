
var
	extend               = require('../../utility/extend'),
	Server_Connection    = require('../connection'),
	ServerDetails        = require('../../server-details'),
	Message_Command_Pass = require('../../message/command/pass');


class Server_Connection_Server extends Server_Connection {

	connect(parameters, callback) {
		var server_details = this.getRemoteServerDetails();

		server_details.setHostname(parameters.hostname);
		server_details.setPort(parameters.port);

		return super.connect(parameters, callback);
	}

	/**
	 * Override the parent class's handleSocketConnect() method in order to
	 * send the necessary registration messages to the remote server.
	 *
	 * @returns {void}
	 */
	handleSocketConnect() {
		super.handleSocketConnect();

		this.sendRegistrationMessages();
	}

	sendRegistrationMessages() {
		this.sendRegistrationPasswordMessage();
		this.sendRegistrationServerMessage();
	}

	sendRegistrationPasswordMessage() {
		var message = new Message_Command_Pass();

		message.setPassword(this.getPassword());
		message.setProtocolVersion(this.getProtocolVersion());
		message.setProtocolFlags(this.getProtocolFlags());
		message.setProtocolOptions(this.getProtocolOptions());

		this.sendMessage(message);
	}

	getPassword() {
		return 'balrog';
	}

	getProtocolVersion() {
		return '0210';
	}

	getProtocolFlags() {
		return 'IRC|';
	}

	getProtocolOptions() {
		return [ ];
	}

	sendRegistrationServerMessage() {
	}

	/**
	 * @returns {string}
	 */
	getTargetString() {
		return this.getRemoteServerDetails().getTargetString();
	}

	/**
	 * @returns {ServerDetails}
	 */
	getRemoteServerDetails() {
		if (!this.remote_server_details) {
			this.remote_server_details = new ServerDetails();
		}

		return this.remote_server_details;
	}

	/**
	 * @param   {ServerDetails} server_details
	 * @returns {self}
	 */
	setRemoteServerDetails(server_details) {
		this.remote_server_details = server_details;
		return this;
	}

}

extend(Server_Connection_Server.prototype, {
	remote_server_details: null
});

module.exports = Server_Connection_Server;
