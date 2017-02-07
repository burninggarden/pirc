
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerNotRegisteredMessage extends ServerMessage {

}

extend(ServerNotRegisteredMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOTREGISTERED
});

module.exports = ServerNotRegisteredMessage;
