
var
	extend            = req('/lib/utilities/extend'),
	ServerMessage     = req('/lib/server/message'),
	ReplyNumerics     = req('/lib/constants/reply-numerics'),
	NotOnChannelError = req('/lib/errors/not-on-channel');


class ServerNotOnChannelMessage extends ServerMessage {

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

	toError() {
		var channel_name = this.getChannelDetails().getName();

		return new NotOnChannelError(channel_name);
	}

}

extend(ServerNotOnChannelMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOTONCHANNEL,
	body:          'You are not on the specified channel'
});

module.exports = ServerNotOnChannelMessage;
