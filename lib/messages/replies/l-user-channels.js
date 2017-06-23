
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class LUserChannelsMessage extends ReplyMessage {

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

	reply: Replies.RPL_LUSERCHANNELS,
	abnf:  '<channel-count> " :channels formed"'

});

module.exports = LUserChannelsMessage;
