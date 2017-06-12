
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class BannedFromChannelMessage extends ReplyMessage {

	isFromServer() {
		return true;
	}

}

extend(BannedFromChannelMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_BANNEDFROMCHAN,
	channel_name:  null
});

module.exports = BannedFromChannelMessage;
