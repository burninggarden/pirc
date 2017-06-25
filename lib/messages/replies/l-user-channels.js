
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class LUserChannelsMessage extends ReplyMessage {

	getChannelCount() {
		return this.channel_count;
	}

	setChannelCount(channel_count) {
		this.channel_count = channel_count;
		return this;
	}

	getValuesForParameters() {
		return {
			channel_count: this.getChannelCount()
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelCount(parameters.get('channel_count'));
	}

}

extend(LUserChannelsMessage.prototype, {

	reply:         Replies.RPL_LUSERCHANNELS,
	abnf:          '<channel-count> " :channels formed"',
	channel_count: null

});

module.exports = LUserChannelsMessage;
