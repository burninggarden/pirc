
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Reply        = req('/lib/constants/replies');


class InviteOnlyChannelMessage extends ReplyMessage {

	constructor(nick, channel) {
		super();

		this.nick    = nick;
		this.channel = channel;
	}

}

extend(InviteOnlyChannelMessage.prototype, {
	reply:   Replies.ERR_INVITEONLYCHAN,
	nick:    null,
	channel: null
});

module.exports = InviteOnlyChannelMessage;
