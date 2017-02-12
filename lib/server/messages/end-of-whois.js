var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerEndOfWhoisMessage extends ServerMessage {

	applyParsedParams(middle_params, trailing_param) {
		this.getUserDetails().setNick(middle_params[0]);
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			nick = this.getUserDetails().getNick(),
			body = this.getBody();

		return `${nick} :${body}`;
	}

}

extend(ServerEndOfWhoisMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFWHOIS,
	body:          'End of WHOIS list'

});

module.exports = ServerEndOfWhoisMessage;
