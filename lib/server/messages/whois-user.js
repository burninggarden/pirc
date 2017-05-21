
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class ServerWhoisUserMessage extends ServerMessage {

	serializeParameters() {
		var
			targets      = this.serializeTargets(),
			user_details = this.getTargetUserDetails(),
			nick         = user_details.getNick(),
			username     = user_details.getUsername(),
			hostname     = user_details.getHostname(),
			realname     = user_details.getRealname();

		return `${targets} ${nick} ${username} ${hostname} * :${realname}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		if (middle_parameters.length !== 5) {
			throw new Error('Invalid message: ' + this.raw_message);
		}

		this.addTargetFromString(middle_parameters[0]);

		var user_details = this.getTargetUserDetails();

		user_details.setNick(middle_parameters[1]);
		user_details.setUsername(middle_parameters[2]);
		user_details.setHostname(middle_parameters[3]);

		// NOTE: There is also a trailing asterisk "*" parameter,
		// but it is ignored.

		user_details.setRealname(trailing_parameter);
	}

}

extend(ServerWhoisUserMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_WHOISUSER

});

module.exports = ServerWhoisUserMessage;
