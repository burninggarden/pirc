
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class BannedFromChannelMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

}

extend(BannedFromChannelMessage.prototype, {
	reply:        Enum_Replies.ERR_BANNEDFROMCHAN,
	abnf:         '<channel-name> " :Cannot join channel (+b)"',
	channel_name: null
});

module.exports = BannedFromChannelMessage;
