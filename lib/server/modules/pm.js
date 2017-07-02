
/**
 * This module is responsible for sending messages directly between users.
 */

var
	extend = req('/lib/utilities/extend');

var
	Commands     = req('/lib/constants/commands'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	ModuleTypes  = req('/lib/constants/module-types');

var
	Module              = req('/lib/server/module'),
	InvalidCommandError = req('/lib/errors/invalid-command');

var
	PrivateMessage = req('/lib/messages/commands/private'),
	NoticeMessage  = req('/lib/messages/commands/notice');


class PMModule extends Module {

	coupleToClient() {
		// Deliberately a noop
	}

	decoupleFromClient() {
		// Deliberately a noop
	}

	handleClientMessage(client, message) {
		client.getUserDetails().bumpIdleStartTimestamp();

		var user_targets = message.getUserMessageTargets();

		user_targets.forEach(function each(user_target) {
			this.handleClientMessageToUserTarget(
				client,
				message,
				user_target
			);
		}, this);
	}

	handleClientMessageToUserTarget(client, message, user_target) {
		var target_client = this.getClientForNickname(user_target);

		if (!target_client) {
			return this.sendNoSuchNickMessageToClientForNickname(
				client,
				user_target
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
				outbound_message = new PrivateMessage();
				break;

			case Commands.NOTICE:
				outbound_message = new NoticeMessage();
				break;

			default:
				throw new InvalidCommandError(command, ErrorReasons.UNSUPPORTED);
		}

		outbound_message.setOriginUserId(source_client.getUserId());
		outbound_message.setMessageBody(message.getMessageBody());

		target_client.sendMessage(outbound_message);
	}


}

extend(PMModule.prototype, {

	type: ModuleTypes.PM

});

module.exports = PMModule;
