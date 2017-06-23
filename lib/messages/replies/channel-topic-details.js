
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class ChannelTopicDetailsMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			channel_name: this.getChannelName(),
			user_id:      this.getUserId(),
			nickname:     this.getNickname(),
			timestamp:    this.getTimestamp()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.get('channel_name'));
		this.setUserId(parameters.get('user_id'));
		this.setNickname(parameters.get('nickname'));
		this.setTimestamp(parameters.get('timestamp'));
	}

}

extend(ChannelTopicDetailsMessage.prototype, {
	reply: Replies.RPL_TOPICWHOTIME,
	abnf:  '<channel-name> " " (<user-id> / <nick>) " " <timestamp>'
});

module.exports = ChannelTopicDetailsMessage;
