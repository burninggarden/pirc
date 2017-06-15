
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class BannedFromChannelMessage extends ReplyMessage {

	isFromServer() {
		return true;
	}

}

extend(BannedFromChannelMessage.prototype, {
	reply:        Replies.ERR_BANNEDFROMCHAN,
	channel_name: null
});

module.exports = BannedFromChannelMessage;
