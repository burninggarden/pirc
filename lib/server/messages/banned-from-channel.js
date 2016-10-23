
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class BannedFromChannelMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

}

extend(BannedFromChannelMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_BANNEDFROMCHAN,
	channel_name:  null
});

module.exports = BannedFromChannelMessage;
