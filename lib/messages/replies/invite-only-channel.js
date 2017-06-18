
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class InviteOnlyChannelMessage extends ReplyMessage {

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
	reply: Replies.ERR_INVITEONLYCHAN
});

module.exports = InviteOnlyChannelMessage;
