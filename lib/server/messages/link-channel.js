
var
	extend               = req('/utilities/extend'),
	ServerMessage        = req('/lib/server/message'),
	ReplyNumerics        = req('/constants/reply-numerics'),
	ChannelNameValidator = req('/validators/channel-name');

class LinkChannelMessage extends ServerMessage {

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

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params[0]);
		this.setDesiredChannelName(middle_params[1]);
		this.setLinkedChannelName(middle_params[2]);
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			targets         = this.serializeTargets(),
			desired_channel = this.getDesiredChannelName(),
			linked_channel  = this.getLinkedChannelName(),
			body            = this.getBody();

		return `${targets} ${desired_channel} ${linked_channel} :${body}`;
	}

}

extend(LinkChannelMessage.prototype, {

	reply_numeric:        ReplyNumerics.ERR_LINKCHANNEL,
	desired_channel_name: null,
	linked_channel_name:  null,
	body:                 'Forwarding to another channel'

});

module.exports = LinkChannelMessage;
