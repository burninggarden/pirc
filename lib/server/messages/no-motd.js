
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerNoMotdMessage extends ServerMessage {

	serializeParams() {
		return ':' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		if (middle_params.length !== 0) {
			throw new Error(`
				Invalid middle params received: ${middle_params}
			`);
		}

		this.setBody(trailing_param);
	}

}

extend(ServerNoMotdMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOMOTD,
	body:          'MOTD File is missing'
});

module.exports = ServerNoMotdMessage;
