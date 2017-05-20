
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class InviteOnlyChannelMessage extends ServerMessage {

	constructor(nick, channel) {
		super();

		this.nick    = nick;
		this.channel = channel;
	}

}

extend(InviteOnlyChannelMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_INVITEONLYCHAN,
	nick:          null,
	channel:       null
});

module.exports = InviteOnlyChannelMessage;
