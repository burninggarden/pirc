
var
	extend              = req('/utilities/extend'),
	ServerMessage       = req('/lib/server/message'),
	ReplyNumerics       = req('/constants/reply-numerics'),
	getCurrentTimestamp = req('/utilities/get-current-timestamp');


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

		var seconds_idle = parseInt(middle_params[2]);

		user_details.setIdleStartTimestamp(
			getCurrentTimestamp() - seconds_idle
		);

		if (middle_params.length === 4) {
			let signon_timestamp = parseInt(middle_params[3]);

			user_details.setSignonTimestamp(signon_timestamp);
		}

		this.setBody(trailing_param);
	}

}

extend(ServerWhoisIdleMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISIDLE,
	body:          ':seconds idle, signon time'

});

module.exports = ServerWhoisIdleMessage;
