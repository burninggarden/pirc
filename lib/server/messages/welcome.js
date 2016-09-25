var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerWelcomeMessage extends ServerMessage {

}


extend(ServerWelcomeMessage.prototype, {
	reply_numeric: ReplyNumerics.RPL_WELCOME
});

module.exports = ServerWelcomeMessage;
