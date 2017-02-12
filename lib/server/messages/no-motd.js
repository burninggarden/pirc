
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerNoMotdMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

	serializeParams() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerNoMotdMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOMOTD,
	body:          'MOTD File is missing'
});

module.exports = ServerNoMotdMessage;
