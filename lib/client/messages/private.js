var req = require('req');

var
	extend         = req('/utilities/extend'),
	ClientMessage  = req('/lib/client/message'),
	Commands       = req('/constants/commands'),
	StructureItems = req('/constants/structure-items'),
	Regexes        = req('/constants/regexes'),
	MessageBuilder = req('/lib/message-builder');


class ClientPrivateMessage extends ClientMessage {

	getMessagePartAtIndex(index) {
		if (index !== 1) {
			throw new Error('Unexpected index: ' + index);
		}

		if (this.hasChannelName()) {
			return this.getChannelName();
		} else {
			throw new Error('implement');
		}
	}

	processMessagePartAtIndex(message_part, index) {
		if (index !== 1) {
			throw new Error('Unexpected index: ' + index);
		}

		if (Regexes.CHANNEL.test(message_part)) {
			this.processMessagePartAsChannelName(message_part);
		} else {
			this.processMessagePartAsUserIdentifier(message_part);
		}
	}

}


extend(ClientPrivateMessage.prototype, {
	structure_definition: [
		StructureItems.COMMAND,
		StructureItems.OTHER,
		StructureItems.BODY
	],
	command: Commands.PRIVMSG
});

function getMultipleChannelMessages(parameters) {
	function createMessage() {
		var message = new ClientPrivateMessage();

		message.setChannelName(parameters.channel_name);

		return message;
	}

	return MessageBuilder.buildMultipleMessages(
		parameters.body,
		createMessage
	);
}

ClientPrivateMessage.getMultipleChannelMessages = getMultipleChannelMessages;

module.exports = ClientPrivateMessage;
