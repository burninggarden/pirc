
var
	extend                = req('/lib/utility/extend'),
	Message_Reply         = req('/lib/message/reply'),
	Enum_Replies          = req('/lib/enum/replies'),
	Validator_ChannelName = req('/lib/validator/channel-name');

class Message_Reply_LinkChannel extends Message_Reply {

	setChannelName(channel_name) {
		this.channel_name = channel_name;
	}

	getChannelName() {
		return this.channel_name;
	}

	setLinkedChannelName(channel_name) {
		Validator_ChannelName.validate(channel_name);
		this.linked_channel_name = channel_name;
	}

	getLinkedChannelName() {
		return this.linked_channel_name;
	}

	getValuesForParameters() {
		return {
			channel_name: [
				this.getChannelName(),
				this.getLinkedChannelName()
			]
		};
	}

	setValuesFromParameters(parameters) {
		this.setChannelName(parameters.getNext('channel_name'));
		this.setLinkedChannelName(parameters.getNext('channel_name'));
	}

}

extend(Message_Reply_LinkChannel.prototype, {

	reply:               Enum_Replies.ERR_LINKCHANNEL,
	abnf:                '<channel-name> " " <channel-name> " :Forwarding to another channel"',
	channel_name:        null,
	linked_channel_name: null

});

module.exports = Message_Reply_LinkChannel;
