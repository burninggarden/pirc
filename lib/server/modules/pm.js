
/**
 * This module is responsible for sending messages directly between users.
 */

var
	extend = req('/utilities/extend');

var
	Commands     = req('/constants/commands'),
	ErrorReasons = req('/constants/error-reasons'),
	ModuleTypes  = req('/constants/module-types');

var
	Module              = req('/lib/server/module'),
	InvalidCommandError = req('/lib/errors/invalid-command'),
	PrivateMessage      = req('/lib/server/messages/private'),
	NoticeMessage       = req('/lib/server/messages/notice');


class PMModule extends Module {

	coupleToClient() {
		// Deliberately a noop
	}

	decoupleFromClient() {
		// Deliberately a noop
	}

	handleClientMessage(client, message) {
		client.getUserDetails().bumpIdleStartTimestamp();

		var users = message.getUserTargets();

		users.forEach(function each(user_details) {
			this.handleClientMessageToUserDetails(
				client,
				message,
				user_details
			);
		}, this);
	}

	handleClientMessageToUserDetails(client, message, user_details) {
		var target_client = this.getClientForUserDetails(user_details);

		if (!target_client) {
			return this.sendNoSuchNickMessageToClientForUserDetails(
				client,
				user_details
			);
		}

		return this.handleClientMessageToClient(
			client,
			message,
			target_client
		);
	}

	handleClientMessageToClient(source_client, message, target_client) {
		// TODO: Permissions etc
		var
			command = message.getCommand(),
			outbound_message;

		switch (command) {
			case Commands.PRIVMSG:
				outbound_message = PrivateMessage.fromInboundMessage(message);
				break;

			case Commands.NOTICE:
				outbound_message = NoticeMessage.fromInboundMessage(message);
				break;

			default:
				throw new InvalidCommandError(command, ErrorReasons.UNSUPPORTED);
		}

		target_client.sendMessage(outbound_message);
	}


}

extend(PMModule.prototype, {

	type: ModuleTypes.PM

});

module.exports = PMModule;
