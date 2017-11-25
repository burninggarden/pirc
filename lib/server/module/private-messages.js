
/**
 * This module is responsible for sending messages directly between users.
 */

var
	extend = req('/lib/utility/extend');

var
	Enum_Commands    = req('/lib/enum/commands'),
	Enum_ModuleTypes = req('/lib/enum/module-types');

var
	Server_Module = req('/lib/server/module');

var
	Message_Command_Private = req('/lib/message/command/private'),
	Message_Command_Notice  = req('/lib/message/command/notice');


class Server_Module_PrivateMessages extends Server_Module {

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
			case Enum_Commands.PRIVMSG:
				outbound_message = new Message_Command_Private();
				break;

			case Enum_Commands.NOTICE:
				outbound_message = new Message_Command_Notice();
				break;

			default:
				throw new Error('Invalid command: ' + command);
		}

		outbound_message.setOriginUserId(source_client.getUserId());
		outbound_message.setMessageBody(message.getMessageBody());

		target_client.sendMessage(outbound_message);
	}


}

extend(Server_Module_PrivateMessages.prototype, {

	type: Enum_ModuleTypes.PRIVATE_MESSAGES

});

module.exports = Server_Module_PrivateMessages;
