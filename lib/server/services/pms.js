
/**
 * This service is responsible for sending messages directly between users.
 */

var
	Commands     = req('/constants/commands'),
	ErrorReasons = req('/constants/error-reasons');

var
	Service             = req('/lib/server/service'),
	InvalidCommandError = req('/lib/errors/invalid-command'),
	NoSuchNickMessage   = req('/lib/server/messages/no-such-nick'),
	PrivateMessage      = req('/lib/server/messages/private');


class PMService extends Service {

	registerClient() {
		// Deliberately a noop
	}

	unregisterClient() {
		// Deliberately a noop
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.PRIVMSG:
				return this.handleClientPrivateMessage(client, message);

			default:
				throw new InvalidCommandError(command, ErrorReasons.UNSUPPORTED);
		}
	}

	handleClientPrivateMessage(client, message) {
		var client_targets = message.getClientTargets();

		client_targets.forEach(function each(client_target) {
			this.handleClientPrivateMessageToClientDetails(
				client,
				message,
				client_target
			);
		}, this);
	}

	handleClientPrivateMessageToClientDetails(client, message, client_details) {
		var target_client = this.getClientForClientDetails(client_details);

		if (!target_client) {
			return this.sendNoSuchNickMessageToClientForClientDetails(
				client,
				client_details
			);
		}

		return this.handleClientPrivateMessageToClient(
			client,
			message,
			target_client
		);
	}

	handleClientPrivateMessageToClient(source_client, message, target_client) {
		// TODO: Permissions etc
		var outbound_message = PrivateMessage.fromInboundMessage(message);

		target_client.sendMessage(outbound_message);
	}

	sendNoSuchNickMessageToClientForClientDetails(client, client_details) {
		var message = new NoSuchNickMessage();

		message.setNick(client_details.getNick());

		client.sendMessage(message);
	}

}

module.exports = PMService;
