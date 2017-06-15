

var
	InboundConnection = req('/lib/server/connections/inbound'),
	ConnectionEvents  = req('/lib/constants/connection-events'),
	Commands          = req('/lib/constants/commands'),
	UserDetails       = req('/lib/user-details'),
	extend            = req('/lib/utilities/extend');


class PendingConnection extends InboundConnection {

	sendMessage(message) {
		if (message.hasReply()) {
			message.addTarget(UserDetails.createPreregistrationStub());
		}

		return super.sendMessage(message);
	}

	handleInboundMessage(message) {
		this.queueMessage(message);

		var command = message.getCommand();

		if (
			   this.getQueuedMessages().length === 1
			&& command !== Commands.PASS
		) {
			return void this.queueUpgradeToClientConnection();
		}

		if (this.getQueuedMessages().length === 2) {
			if (command === Commands.SERVER) {
				return void this.queueUpgradeToServerConnection();
			} else {
				return void this.queueUpgradeToClientConnection();
			}
		}
	}

	queueMessage(message) {
		this.getQueuedMessages().push(message);
	}

	getQueuedMessages() {
		if (!this.queued_messages) {
			this.queued_messages = [ ];
		}

		return this.queued_messages;
	}

	queueUpgradeToClientConnection() {
		clearTimeout(this.upgrade_timer);
		this.upgrade_timer = setTimeout(
			this.upgradeToClientConnection.bind(this),
			0
		);
	}

	queueUpgradeToServerConnection() {
		clearTimeout(this.upgrade_timer);
		this.upgrade_timer = setTimeout(
			this.upgradeToServerConnection.bind(this),
			0
		);
	}

	upgradeToClientConnection() {
		this.decoupleFromSocket(this.getSocket());
		this.emit(ConnectionEvents.UPGRADE_TO_CLIENT_CONNECTION);
	}

	upgradeToServerConnection() {
		this.decoupleFromSocket(this.getSocket());
		this.emit(ConnectionEvents.UPGRADE_TO_SERVER_CONNECTION);
	}

}

extend(PendingConnection.prototype, {
	queued_messages: null,
	upgrade_timer:   null
});

module.exports = PendingConnection;
