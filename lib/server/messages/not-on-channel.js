
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerNotOnChannelMessage extends ServerMessage {

	constructor(nick, channel) {
		super();

		this.nick    = nick;
		this.channel = channel;
	}

}

extend(ServerNotOnChannelMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOTONCHANNEL,
	nick:          null,
	channel:       null
});

module.exports = ServerNotOnChannelMessage;
