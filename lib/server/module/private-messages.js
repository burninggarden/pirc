
/**
 * This module is responsible for sending messages directly between users.
 */

var
	extend = require('../../utility/extend');

var
	Enum_Commands    = require('../../enum/commands'),
	Enum_ModuleTypes = require('../../enum/module-types');

var
	Server_Module = require('../../server/module');

var
	Message_Command_Private = require('../../message/command/private'),
	Message_Command_Notice  = require('../../message/command/notice');


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
			outgoing_message;

		switch (command) {
			case Enum_Commands.PRIVMSG:
				outgoing_message = new Message_Command_Private();
				break;

			case Enum_Commands.NOTICE:
				outgoing_message = new Message_Command_Notice();
				break;

			default:
				throw new Error('Invalid command: ' + command);
		}

		outgoing_message.setOriginUserId(source_client.getUserId());
		outgoing_message.setMessageBody(message.getMessageBody());

		target_client.sendMessage(outgoing_message);
	}


}

extend(Server_Module_PrivateMessages.prototype, {

	type: Enum_ModuleTypes.PRIVATE_MESSAGES

});

module.exports = Server_Module_PrivateMessages;
