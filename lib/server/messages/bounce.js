var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerBounceMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

}

extend(ServerBounceMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_BOUNCE

});

module.exports = ServerBounceMessage;
