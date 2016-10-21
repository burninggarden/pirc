var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerEndOfNamesMessage extends ServerMessage {

	serializeParams() {
		return this.getChannelName() + ' :' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setChannelName(middle_params[0]);
		this.setBody(trailing_param);
	}

}

extend(ServerEndOfNamesMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFNAMES,
	body:          'End of /NAMES list.'

});

module.exports = ServerEndOfNamesMessage;
