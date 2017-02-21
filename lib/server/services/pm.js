
/**
 * This service is responsible for sending messages directly between users.
 */

var
	extend = req('/utilities/extend');

var
	Commands     = req('/constants/commands'),
	ErrorReasons = req('/constants/error-reasons'),
	ServiceTypes = req('/constants/service-types');

var
	Service             = req('/lib/server/service'),
	InvalidCommandError = req('/lib/errors/invalid-command'),
	PrivateMessage      = req('/lib/server/messages/private');


class PMService extends Service {

	coupleToClient() {
		// Deliberately a noop
	}

	decoupleFromClient() {
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
		client.getUserDetails().bumpIdleStartTimestamp();

		var users = message.getUserTargets();

		users.forEach(function each(user_details) {
			this.handleClientPrivateMessageToUserDetails(
				client,
				message,
				user_details
			);
		}, this);
	}

	handleClientPrivateMessageToUserDetails(client, message, user_details) {
		var target_client = this.getClientForUserDetails(user_details);

		if (!target_client) {
			return this.sendNoSuchNickMessageToClientForUserDetails(
				client,
				user_details
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

}

extend(PMService.prototype, {

	type: ServiceTypes.PM

});

module.exports = PMService;
