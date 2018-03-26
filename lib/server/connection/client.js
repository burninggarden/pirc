var
	extend            = require('../../utility/extend'),
	Server_Connection = require('../../server/connection'),
	UserDetails       = require('../../user-details');


var
	Enum_ConnectionEvents = require('../../enum/connection-events'),
	Enum_Commands         = require('../../enum/commands'),
	Enum_SourceTypes      = require('../../enum/source-types'),
	Enum_UserModes        = require('../../enum/user-modes');

var
	Message_Reply_NotRegistered = require('../../message/reply/not-registered');


class Server_Connection_Client extends Server_Connection {

	/**
	 * Override the parent class's setSocket() method in order to assign
	 * the client's hostname from their remote address.
	 *
	 * @param   {Net.Socket} socket
	 * @returns {self}
	 */
	setSocket(socket) {
		super.setSocket(socket);

		if (socket) {
			this.getUserDetails().setHostname(this.getIP());
		}

		return this;
	}

	handleIncomingMessage(message) {
		if (this.isDisconnected() || this.isDisconnecting()) {
			return;
		}

		if (!this.isRegistered() && !this.isRegistering()) {
			this.handlePreRegistrationMessage(message);
		} else {
			message.parseParameters();
		}

		if (this.hasUserId()) {
			message.setOriginUserId(this.getUserId());
		}

		this.emit(Enum_ConnectionEvents.INCOMING_MESSAGE, this, message);
	}

	handlePreRegistrationMessage(message) {
		switch (message.getCommand()) {
			case Enum_Commands.NICK:
				return this.handlePreRegistrationNickMessage(message);

			case Enum_Commands.USER:
				return this.handlePreRegistrationUserMessage(message);

			case Enum_Commands.PASS:
				return this.handlePreRegistrationPassMessage(message);

			case Enum_Commands.CAP:
				return this.queueMessageUntilRegistration(message);

			default:
				return this.handleUnsupportedPreregistrationMessage(message);
		}
	}

	handlePreRegistrationNickMessage(message) {
		message.parseParameters();

		if (message.hasImmediateResponse()) {
			return void message.setIsLethal();
		}

		// Note that this duplicates functionality performed by the Nicks
		// service. This is necessary in order for response messages from
		// the server to this client during its eventual registration to be
		// generated successfully.
		this.getUserDetails().setNickname(message.getNickname());
		this.setHasReceivedRegistrationNickMessage(true);
	}

	handlePreRegistrationUserMessage(message) {
		message.parseParameters();

		if (message.hasImmediateResponse()) {
			return void message.setIsLethal();
		}

		var user_details = this.getUserDetails();

		user_details.setUsername(message.getUsername());
		user_details.setRealname(message.getRealname());

		if (message.hasHostname()) {
			user_details.setHostname(message.getHostname());
		}

		// TODO: Apply user mode mask from message, if supplied

		this.setHasReceivedRegistrationUserMessage(true);
	}

	handlePreRegistrationPassMessage(message) {
		message.parseParameters();

		if (message.hasImmediateResponse()) {
			return void message.setIsLethal();
		}

		this.getUserDetails().setPassword(message.getPassword());
	}

	handleUnsupportedPreregistrationMessage(incoming_message) {
		var outgoing_message = new Message_Reply_NotRegistered();

		this.sendMessage(outgoing_message);
	}

	getUserDetails() {
		if (!this.user_details) {
			this.user_details = new UserDetails();
		}

		return this.user_details;
	}

	getTargetString() {
		if (!this.isRegistered()) {
			return '*';
		}

		return this.getNickname();
	}

	getUserId() {
		return this.getUserDetails().getUserId();
	}

	/**
	 * @returns {boolean}
	 */
	canRegister() {
		if (this.isRegistering()) {
			return false;
		}

		return (
			   this.hasReceivedRegistrationNickMessage()
			&& this.hasReceivedRegistrationUserMessage()
		);
	}

	/**
	 * @returns {boolean}
	 */
	hasReceivedRegistrationNickMessage() {
		return this.registration_nick_message_received;
	}

	/**
	 * Store whether this client connection has received a registration
	 * NICK message. This is necessary before the connection can be properly
	 * activated.
	 *
	 * @param   {boolean} value
	 * @returns {self}
	 */
	setHasReceivedRegistrationNickMessage(value) {
		this.registration_nick_message_received = value;

		return this;
	}

	/**
	 * @returns {boolean}
	 */
	hasReceivedRegistrationUserMessage() {
		return this.registration_user_message_received;
	}

	/**
	 * Store whether this client connection has received a registration
	 * USER message. This is necessary before the connection can be properly
	 * activated.
	 *
	 * @param   {boolean} value
	 * @returns {self}
	 */
	setHasReceivedRegistrationUserMessage(value) {
		this.registration_user_message_received = value;

		return this;
	}

	getSourceType() {
		return Enum_SourceTypes.CLIENT;
	}

	isServer() {
		return false;
	}

	getIP() {
		var ip = this.getSocket().remoteAddress;

		if (ip.indexOf('::ffff:') === 0) {
			ip = ip.slice(7);
		}

		if (ip === '::1') {
			ip = '127.0.0.1';
		}

		return ip;
	}

	getUserId() {
		return this.getUserDetails().getUserId();
	}

	hasUserId() {
		return this.getUserId() !== null;
	}

	getNickname() {
		return this.getUserDetails().getNickname();
	}

	hasNickname() {
		return this.getNickname() !== null;
	}

	getUsername() {
		return this.getUserDetails().getUsername();
	}

	setUsername(username) {
		this.getUserDetails().setUsername(username);
		return this;
	}

	hasUsername() {
		return this.getUsername() !== null;
	}

	setRealname(realname) {
		this.getUserDetails().setRealname(realname);
		return this;
	}

	getRealname() {
		return this.getUserDetails().getRealname();
	}

	setHostname(hostname) {
		this.getUserDetails().setHostname(hostname);
		return this;
	}

	getHostname() {
		return this.getUserDetails().getHostname();
	}

	hasPassword() {
		return this.getPassword() !== null;
	}

	getPassword() {
		return this.getUserDetails().getPassword();
	}

	getHopCount() {
		return this.getUserDetails().getHopCount();
	}

	setHopCount(hop_count) {
		this.getUserDetails().setHopCount(hop_count);
		return this;
	}

	getServerToken() {
		return this.getUserDetails().getServerToken();
	}

	setServerToken(server_token) {
		this.getUserDetails().setServerToken(server_token);
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	hasServerToken() {
		return this.getServerToken() !== null;
	}

	/**
	 * @returns {Enum_UserModes.XXX[]}
	 */
	getUserModes() {
		return this.getUserDetails().getModes();
	}

	/**
	 * @param   {Enum_UserModes.XXX[]} user_modes
	 * @returns {self}
	 */
	setUserModes(user_modes) {
		this.getUserDetails().setModes(user_modes);
		return this;
	}

	/**
	 * @param   {boolean} is_authenticated
	 * @returns {self}
	 */
	setIsAuthenticated(is_authenticated) {
		this.getUserDetails().setIsAuthenticated(is_authenticated);
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	isRestricted() {
		return this.getUserDetails().isRestricted();
	}

	/**
	 * @returns {boolean}
	 */
	isOperator() {
		return this.getUserDetails().isOperator();
	}

	/**
	 * @param   {string} message
	 * @returns {self}
	 */
	setAwayMessage(message) {
		var user_details = this.getUserDetails();

		user_details.setAwayMessage(message);

		if (message) {
			user_details.addMode(Enum_UserModes.AWAY);
		} else {
			user_details.removeMode(Enum_UserModes.AWAY);
		}

		return this;
	}

	isClientConnection() {
		return true;
	}

	getRemoteServerConnection() {
		return this.remote_server_connection;
	}

	setRemoteServerConnection(server_connection) {
		this.remote_server_connection = server_connection;
		return this;
	}

	hasRemoteServerConnection() {
		return this.getRemoteServerConnection() !== null;
	}

	setLocalServerDetails(server_details) {
		if (!this.hasServerToken()) {
			this.setServerToken(server_details.getToken());
		}

		return super.setLocalServerDetails(server_details);
	}

}


extend(Server_Connection_Client.prototype, {

	registration_user_message_received: false,
	registration_nick_message_received: false,


	user_details:                       null,
	host_server_details:                null,

	remote_server_connection:           null

});

module.exports = Server_Connection_Client;
