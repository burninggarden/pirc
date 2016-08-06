var
	extend         = req('/utilities/extend'),
	ServerMessage  = req('/lib/server/message'),
	Commands       = req('/constants/commands'),
	StructureItems = req('/constants/structure-items'),
	Regexes        = req('/constants/regexes');


class ServerPrivateMessage extends ServerMessage {

	getMessagePartAtIndex(index) {
		if (index !== 2) {
			throw new Error('Unexpected index: ' + index);
		}

		if (this.hasChannelName()) {
			return this.getChannelName();
		} else {
			throw new Error('implement');
		}
	}

	processMessagePartAtIndex(message_part, index) {
		if (index !== 2) {
			throw new Error('Unexpected index: ' + index);
		}

		if (Regexes.CHANNEL.test(message_part)) {
			this.processMessagePartAsChannelName(message_part);
		} else {
			this.processMessagePartAsUserIdentifier(message_part);
		}
	}

}

extend(ServerPrivateMessage.prototype, {
	structure_definition: [
		StructureItems.USER_IDENTIFIER,
		StructureItems.COMMAND,
		StructureItems.OTHER,
		StructureItems.BODY
	],
	command:              Commands.PRIVMSG

});


ServerPrivateMessage.fromInboundMessage = function fromInboundMessage(message) {
	var resultant_message = new ServerPrivateMessage();

	if (message.hasChannelName()) {
		resultant_message.setChannelName(message.getChannelName());
	} else if (message.hasNick()) {
		resultant_message.setNick(message.getNick());
	}

	resultant_message.setUsername(message.getUsername());
	resultant_message.setHostname(message.getHostname());

	resultant_message.setBody(message.getBody());

	return resultant_message;
};


module.exports = ServerPrivateMessage;
