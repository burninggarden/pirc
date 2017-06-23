
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class NoChannelTopicMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
	}

}

extend(NoChannelTopicMessage.prototype, {
	reply: Replies.RPL_NOTOPIC,
	abnf:  '<channel-name> " :No topic is set"'
});

module.exports = NoChannelTopicMessage;
