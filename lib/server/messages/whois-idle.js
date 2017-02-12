
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerWhoisIdleMessage extends ServerMessage {

	serializeParams() {
		var
			targets          = this.serializeTargets(),
			user_details     = this.getTargetUserDetails(),
			nick             = user_details.getNick(),
			seconds_idle     = user_details.getSecondsIdle(),
			signon_timestamp = user_details.getSignonTimestamp(),
			body             = this.getBody();

		return `${targets} ${nick} ${seconds_idle} ${signon_timestamp} ${body}`;

	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_params[1]);
		user_details.setSecondsIdle(parseInt(middle_params[2]));

		if (middle_params.length === 4) {
			user_details.setSignonTimestamp(parseInt(middle_params[3]));
		}

		this.setBody(trailing_param);
	}

}

extend(ServerWhoisIdleMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISIDLE,
	body:          ':seconds idle, signon time'

});

module.exports = ServerWhoisIdleMessage;
