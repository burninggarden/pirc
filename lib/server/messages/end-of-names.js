var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerEndOfNamesMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

	serializeParams() {
		var
			channel_name = this.getChannelDetails().getName(),
			body         = this.getBody();

		return `${channel_name} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.getChannelDetails().setName(middle_params[0]);
		this.setBody(trailing_param);
	}

}

extend(ServerEndOfNamesMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFNAMES,
	body:          'End of /NAMES list.'

});

module.exports = ServerEndOfNamesMessage;
