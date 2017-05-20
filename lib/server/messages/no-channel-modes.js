
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class ServerNoChannelModesMessage extends ServerMessage {

	serializeParams() {
		var
			targets         = this.serializeTargets(),
			channel_details = this.getChannelDetails(),
			channel_name    = channel_details.getName(),
			body            = this.getBody();

		return `${targets} ${channel_name} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());

		this.getChannelDetails().setName(middle_params.shift());
		this.setBody(trailing_param);
	}

}

extend(ServerNoChannelModesMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOTCHANMODES,
	body:          'The specified channel does not support mode changes'
});

module.exports = ServerNoChannelModesMessage;
