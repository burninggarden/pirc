
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class NeedReggedNickMessage extends ServerMessage {

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

	reply_numeric: ReplyNumerics.ERR_NEEDREGGEDNICK,
	body:          'Cannot join channel (+r) - you need to be identified with services'

});

module.exports = NeedReggedNickMessage;
