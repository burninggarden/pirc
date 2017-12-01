
var
	extend            = require('../../utility/extend'),
	Server_Connection = require('../connection'),
	ServerDetails     = require('../../server-details');

var
	Enum_Commands         = require('../../enum/commands'),
	Enum_ConnectionEvents = require('../../enum/connection-events');

var
	Message_Command_Pass   = require('../../message/command/pass'),
	Message_Command_Server = require('../../message/command/server'),
	Message_Command_Error  = require('../../message/command/error');


class Server_Connection_Server extends Server_Connection {

	handleIncomingMessage(message) {
		if (this.isDisconnected() || this.isDisconnecting()) {
			return;
		}

		if (!this.isRegistered() && !this.isRegistering()) {
			this.handlePreRegistrationMessage(message);
		} else {
			message.parseParameters();
		}

		this.emit(Enum_ConnectionEvents.INCOMING_MESSAGE, this, message);
	}

	handlePreRegistrationMessage(message) {
		switch (message.getCommand()) {
			case Enum_Commands.PASS:
				return this.handlePreRegistrationPassMessage(message);

			case Enum_Commands.SERVER:
				return this.handlePreRegistrationServerMessage(message);

			default:
				return this.handleUnsupportedPreregistrationMessage(message);
		}
	}

	handlePreRegistrationPassMessage(message) {
		message.parseParameters();

		if (message.hasImmediateResponse()) {
			return void message.setIsLethal();
		}

		this.getRemoteServerDetails().setPassword(message.getPassword());
		this.setHasReceivedRegistrationPassMessage(true);
	}

	handlePreRegistrationServerMessage(message) {
		message.parseParameters();

		if (message.hasImmediateResponse()) {
			return void message.setIsLethal();
		}

		var server_details = this.getRemoteServerDetails();

		server_details.setHostname(message.getHostname());
		server_details.setHopCount(message.getHopCount());
		server_details.setToken(message.getServerToken());
		server_details.setInfo(message.getServerInfo());

		this.setHasReceivedRegistrationServerMessage(true);
	}

	handleUnsupportedPreregistrationMessage(incoming_message) {
		var outgoing_message = new Message_Command_Error();

		outgoing_message.setText('Connection was not yet registered');

		this.sendMessage(outgoing_message);
		this.disconnectSafe(function handler() {
			// ???
		});
	}

	/**
	 * Override the parent class's connect() method in order to grab some of
	 * the connection parameters to set locally first.
	 *
	 * @param   {object} parameters
	 * @param   {function} callback
	 * @returns {void}
	 */
	connect(parameters, callback) {
		var server_details = this.getRemoteServerDetails();

		server_details.setHostname(parameters.host);
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
		this.setHasSentRegistrationMessages(true);
	}

	sendRegistrationPasswordMessage() {
		var message = new Message_Command_Pass();

		message.setPassword(this.getPassword());
		message.setProtocolVersion(this.getProtocolVersion());
		message.setProtocolFlags(this.getProtocolFlags());
		message.setProtocolOptions(this.getProtocolOptions());

		this.sendMessage(message);
	}

	sendRegistrationServerMessage() {
		var message = Message_Command_Server.fromServerConnection(this);

		this.sendMessage(message);
	}

	/**
	 * @param   {boolean} has_sent_registration_messages
	 * @returns {self}
	 */
	setHasSentRegistrationMessages(has_sent_registration_messages = true) {
		this.has_sent_registration_messages = has_sent_registration_messages;
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	hasSentRegistrationMessages() {
		return this.has_sent_registration_messages;
	}

	getHostname() {
		return this.getLocalServerDetails().getHostname();
	}

	/**
	 * @returns {string}
	 */
	getPassword() {
		return this.getLocalServerDetails().getPassword();
	}

	getHopCount() {
		return this.getLocalServerDetails().getHopCount();
	}

	/**
	 * @returns {string}
	 */
	getProtocolVersion() {
		// TODO: Make this read from local server details instead
		return '0210';
	}

	/**
	 * @returns {string}
	 */
	getProtocolFlags() {
		return 'IRC|';
	}

	/**
	 * @returns {string[]}
	 */
	getProtocolOptions() {
		return [ ];
	}

	/**
	 * @returns {int}
	 */
	getServerToken() {
		return this.getLocalServerDetails().getToken();
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

	/**
	 * @returns {boolean}
	 */
	canRegister() {
		if (this.isRegistering()) {
			return false;
		}

		return (
			   this.hasReceivedRegistrationPassMessage()
			&& this.hasReceivedRegistrationServerMessage()
		);
	}

	/**
	 * @param   {boolean} value
	 * @returns {self}
	 */
	setHasReceivedRegistrationPassMessage(value) {
		this.registration_pass_message_received = value;
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	hasReceivedRegistrationPassMessage() {
		return this.registration_pass_message_received;
	}

	/**
	 * @param   {boolean} value
	 * @returns {self}
	 */
	setHasReceivedRegistrationServerMessage(value) {
		this.registration_server_message_received = value;
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	hasReceivedRegistrationServerMessage() {
		return this.registration_server_message_received;
	}

	isServerConnection() {
		return true;
	}

}

extend(Server_Connection_Server.prototype, {
	registration_pass_message_received:   false,
	registration_server_message_received: false,
	has_sent_registration_messages:       false,
	remote_server_details:                null,
	server_token:                         1
});

module.exports = Server_Connection_Server;
