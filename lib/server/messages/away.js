
var
	extend              = req('/lib/utilities/extend'),
	ServerMessage       = req('/lib/server/message'),
	ReplyNumerics       = req('/lib/constants/reply-numerics'),
	getCurrentTimestamp = req('/lib/utilities/get-current-timestamp');


class ServerAwayMessage extends ServerMessage {

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			user_details = this.getTargetUserDetails(),
			nick         = user_details.getNick(),
			away_message = user_details.getAwayMessage();

		// NOTICE:
		// This reply has two forms: one where only the nick and away message
		// are specified, and another where an additional middle parameter
		// is specified indicating the number of seconds that the user has
		// been away. If the number of seconds are unknown, use the first form.
		if (!user_details.hasSecondsAway()) {
			return `${targets} ${nick} :${away_message}`;
		}

		var seconds_away = user_details.getSecondsAway();

		return `${targets} ${nick} ${seconds_away} :${away_message}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_parameters[1]);

		// Some IRCDs specify an additional middle parameter indicating
		// the number of seconds that the user has been away.
		if (middle_parameters.length === 3) {
			let seconds_away = parseInt(middle_parameters[2]);

			user_details.setAwayStartTimestamp(
				getCurrentTimestamp() - seconds_away
			);
		}

		user_details.setAwayMessage(trailing_parameter);
	}

}

extend(ServerAwayMessage.prototype, {

	bnf:           '<nick> :<away message>',

	reply_numeric: ReplyNumerics.RPL_AWAY

});

module.exports = ServerAwayMessage;
