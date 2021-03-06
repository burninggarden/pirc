

var
	Server_Connection = require('../../server/connection'),
	extend            = require('../../utility/extend');

var
	Enum_ConnectionEvents = require('../../enum/connection-events'),
	Enum_Commands         = require('../../enum/commands');


class Server_Connection_Pending extends Server_Connection {

	handleIncomingMessage(message) {
		this.queueMessage(message);

		var command = message.getCommand();

		if (
			   this.getQueuedMessages().length === 1
			&& command !== Enum_Commands.PASS
		) {
			return void this.queueUpgradeToClientConnection();
		}

		if (this.getQueuedMessages().length === 2) {
			if (command === Enum_Commands.SERVER) {
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
		this.emit(Enum_ConnectionEvents.UPGRADE_TO_CLIENT_CONNECTION, this);
	}

	upgradeToServerConnection() {
		this.decoupleFromSocket(this.getSocket());
		this.emit(Enum_ConnectionEvents.UPGRADE_TO_SERVER_CONNECTION, this);
	}

	getTargetString() {
		return '*';
	}

	isPendingConnection() {
		return true;
	}

}

extend(Server_Connection_Pending.prototype, {
	queued_messages: null,
	upgrade_timer:   null
});

module.exports = Server_Connection_Pending;
