
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class ServerEndOfWhoisMessage extends ServerMessage {

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters[0]);
		this.getTargetUserDetails().setNick(middle_parameters[1]);
		this.setBody(trailing_parameter);
	}

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			nick    = this.getUserDetails().getNick(),
			body    = this.getBody();

		return `${targets} ${nick} :${body}`;
	}

}

extend(ServerEndOfWhoisMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFWHOIS,
	body:          'End of /WHOIS list.'

});

module.exports = ServerEndOfWhoisMessage;
