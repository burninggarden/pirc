
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerNoMotdMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

}

extend(ServerNoMotdMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOMOTD,
	body:          'MOTD File is missing'
});

module.exports = ServerNoMotdMessage;
