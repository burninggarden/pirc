var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerEndOfWhoisMessage extends ServerMessage {

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params[0]);
		this.getTargetUserDetails().setNick(middle_params[1]);
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			targets = this.serializeTargets(),
			nick    = this.getUserDetails().getNick(),
			body    = this.getBody();

		return `${targets} ${nick} :${body}`;
	}

}

extend(ServerEndOfWhoisMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFWHOIS,
	body:          'End of WHOIS list'

});

module.exports = ServerEndOfWhoisMessage;
