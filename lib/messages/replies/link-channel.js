
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

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters[0]);
		this.setDesiredChannelName(middle_parameters[1]);
		this.setLinkedChannelName(middle_parameters[2]);
		this.setBody(trailing_parameter);
	}

	serializeParameters() {
		var
			targets         = this.serializeTargets(),
			desired_channel = this.getDesiredChannelName(),
			linked_channel  = this.getLinkedChannelName(),
			body            = this.getBody();

		return `${targets} ${desired_channel} ${linked_channel} :${body}`;
	}

}

extend(LinkChannelMessage.prototype, {

	reply:                Replies.ERR_LINKCHANNEL,
	desired_channel_name: null,
	linked_channel_name:  null,
	body:                 'Forwarding to another channel'

});

module.exports = LinkChannelMessage;
