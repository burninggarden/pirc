
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class NeedReggedNickMessage extends ServerMessage {

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params[0]);
		this.getChannelDetails().setName(middle_params[1]);
		this.setBody(trailing_param);
	}

	serializeParams() {
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
