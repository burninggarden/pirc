
var
	extend              = req('/lib/utilities/extend'),
	ReplyMessage        = req('/lib/messages/reply'),
	ReplyNumerics       = req('/lib/constants/reply-numerics'),
	getCurrentTimestamp = req('/lib/utilities/get-current-timestamp');


class WhoisIdleMessage extends ReplyMessage {

	serializeParameters() {
		var
			targets          = this.serializeTargets(),
			user_details     = this.getTargetUserDetails(),
			nick             = user_details.getNick(),
			seconds_idle     = user_details.getSecondsIdle(),
			signon_timestamp = user_details.getSignonTimestamp(),
			body             = this.getBody();

		return `${targets} ${nick} ${seconds_idle} ${signon_timestamp} ${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_parameters[1]);

		var seconds_idle = parseInt(middle_parameters[2]);

		user_details.setIdleStartTimestamp(
			getCurrentTimestamp() - seconds_idle
		);

		if (middle_parameters.length === 4) {
			let signon_timestamp = parseInt(middle_parameters[3]);

			user_details.setSignonTimestamp(signon_timestamp);
		}

		this.setBody(trailing_parameter);
	}

}

extend(WhoisIdleMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISIDLE,
	body:          ':seconds idle, signon time'

});

module.exports = WhoisIdleMessage;
