
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


class InviteOnlyChannelMessage extends ReplyMessage {

	setChannelName(channel_name) {
		this.channel_name = channel_name;
		return this;
	}

	getChannelName() {
		return this.channel_name;
	}

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

}

extend(InviteOnlyChannelMessage.prototype, {
	reply:        Enum_Replies.ERR_INVITEONLYCHAN,
	abnf:         '<channel-name> " :Cannot join channel (+i)"',
	channel_name: null
});

module.exports = InviteOnlyChannelMessage;
