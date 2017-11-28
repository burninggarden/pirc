
var
	Connection    = require('../connection'),
	extend        = require('../utility/extend'),
	ServerDetails = require('../server-details'),
	TextFormatter = require('../utility/text-formatter');


class Server_Connection extends Connection {

	/**
	 * @param   {Net.Socket|null} socket
	 * @returns {self}
	 */
	setIncomingSocket(socket) {
		if (socket) {
			this.setIsConnected(true);
		}

		return super.setSocket(socket);
	}

	getLocalServerDetails() {
		if (!this.local_server_details) {
			this.local_server_details = new ServerDetails();
		}

		return this.local_server_details;
	}

	setLocalServerDetails(server_details) {
		this.local_server_details = server_details;

		return this;
	}

	getLocalHostname() {
		return this.getLocalServerDetails().getHostname();
	}

	sendMessage(message) {
		if (!message.hasOriginUserId()) {
			message.setOriginHostname(this.getLocalHostname());
		}

		if (!message.hasTarget()) {
			message.setTarget(this.getTargetString());
		}

		return super.sendMessage(message);
	}

	getTargetString() {
		throw new Error('Implement method: getTargetString()');
	}

	getSourceType() {
		throw new Error('Implement method: getSourceType()');
	}

	destroy() {
		this.getSocket().destroy();
	}

	getOutgoingLogPrefix() {
		var id = this.getId();

		return TextFormatter.blue(`[S${id}] SEND: `);
	}

	getIncomingLogPrefix() {
		var id = this.getId();

		return TextFormatter.magenta(`[S${id}] RECV: `);
	}

	queueMessageUntilRegistration(message) {
		this.getRegistrationMessageQueue().push(message);
		return this;
	}

	/**
	 * @returns {array}
	 */
	getRegistrationMessageQueue() {
		if (!this.registration_message_queue) {
			this.registration_message_queue = [ ];
		}

		return this.registration_message_queue;
	}

	/**
	 * Following successful client registration (a USER and NICK message pair
	 * were received), dequeue any messages (including the USER and NICK
	 * messages themselves) that may have been received prior to registration
	 * being completed.
	 *
	 * @returns {self}
	 */
	dequeueMessagesFollowingRegistration() {
		// Make a copy of the queue message array...
		var queue = this.getRegistrationMessageQueue();

		// That way, we can immediately unassign it to prevent cases
		// where straggling messages end up back in the queue after we
		// thought we'd emptied it.
		this.registration_message_queue = null;

		queue.forEach(this.handleIncomingMessageSafe, this);

		return this;
	}

	isPendingConnection() {
		return false;
	}

	isClientConnection() {
		return false;
	}

	isServerConnection() {
		return false;
	}

}

extend(Server_Connection.prototype, {

	local_server_details:       null,

	registration_message_queue: null

});

/**
 * @param   {Server_Connection_Pending} pending_connection
 * @returns {Server_Connection}
 */
function fromPendingConnection(pending_connection) {
	var
		socket = pending_connection.getSocket(),
		client = new this();

	client.setIncomingSocket(socket);

	return client;
}

Server_Connection.fromPendingConnection = fromPendingConnection;

module.exports = Server_Connection;
