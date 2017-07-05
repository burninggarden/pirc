
var
	extend               = req('/lib/utilities/extend'),
	ReplyMessage         = req('/lib/messages/reply'),
	Replies              = req('/lib/constants/replies'),
	ChannelNameValidator = req('/lib/validators/channel-name');

class LinkChannelMessage extends ReplyMessage {

	setChannelName(channel_name) {
		this.channel_name = channel_name;
	}

	getChannelName() {
		return this.channel_name;
	}

	setLinkedChannelName(channel_name) {
		ChannelNameValidator.validate(channel_name);
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

extend(LinkChannelMessage.prototype, {

	reply:               Replies.ERR_LINKCHANNEL,
	abnf:                '<channel-name> " " <channel-name> " :Forwarding to another channel"',
	channel_name:        null,
	linked_channel_name: null

});

module.exports = LinkChannelMessage;
