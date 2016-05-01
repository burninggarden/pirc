var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');

var
	InvalidMessageStructureError = req('/lib/errors/invalid-message-structure');


class ServerNoticeMessage extends ServerMessage {

	setMessageParts(message_parts) {
		console.log(message_parts);
	}

	serialize() {
		return `NOTICE :${this.body}`;
	}

	deserialize() {
		var parts = this.getParts();

		if (parts[0] !== Commands.NOTICE) {
			throw new InvalidMessageStructureError(this.raw_message);
		}

		var body = parts[1].slice(1);

		this.setBody(body);

		return this;
	}

}

extend(ServerNoticeMessage.prototype, {

	command: Commands.NOTICE

});

module.exports = ServerNoticeMessage;
