var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerMotdStartMessage extends ServerMessage {

	getBody() {
		var server_identifier = this.getServerIdentifier();

		return `- ${server_identifier} Message of the day -`;
	}

}

extend(ServerMotdStartMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_MOTDSTART

});

module.exports = ServerMotdStartMessage;
