
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class NeedReggedNickMessage extends ReplyMessage {

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters[0]);
		this.getChannelDetails().setName(middle_parameters[1]);
		this.setBody(trailing_parameter);
	}

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			channel_name = this.getChannelDetails().getName(),
			body         = this.getBody();

		return `${targets} ${channel_name} :${body}`;
	}

}

extend(NeedReggedNickMessage.prototype, {

	reply: Replies.ERR_NEEDREGGEDNICK,
	body:  'Cannot join channel (+r) - you need to be identified with services'

});

module.exports = NeedReggedNickMessage;
