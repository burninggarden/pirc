var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerBounceMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

	applyParsedParams(middle_params, trailing_param) {
		// TODO: actually process the specified server restrictions
		this.setBody(trailing_param);
	}

}

extend(ServerBounceMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ISUPPORT,
	body:          'are supported by this server'

});

module.exports = ServerBounceMessage;
