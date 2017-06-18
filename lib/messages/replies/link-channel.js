
var
	extend               = req('/lib/utilities/extend'),
	ReplyMessage         = req('/lib/messages/reply'),
	Replies              = req('/lib/constants/replies'),
	ChannelNameValidator = req('/lib/validators/channel-name');

class LinkChannelMessage extends ReplyMessage {

	setDesiredChannelName(channel_name) {
		ChannelNameValidator.validate(channel_name);
		this.desired_channel_name = channel_name;
	}

	getDesiredChannelName() {
		return this.desired_channel_name;
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
				this.getDesiredChannelName(),
				this.getLinkedChannelName()
			]
		};
	}

	setValuesFromParameters(parameters) {
		this.setDesiredChannelName(parameters.getNext('channel_name'));
		this.setLinkedChannelName(parameters.getNext('channel_name'));
	}

}

extend(LinkChannelMessage.prototype, {

	reply:                Replies.ERR_LINKCHANNEL,
	desired_channel_name: null,
	linked_channel_name:  null,
	body:                 'Forwarding to another channel'

});

module.exports = LinkChannelMessage;
