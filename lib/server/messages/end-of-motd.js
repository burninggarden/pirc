
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class ServerEndOfMotdMessage extends ServerMessage {

	serializeParams() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerEndOfMotdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFMOTD,
	body:          'End of /MOTD command'

});

module.exports = ServerEndOfMotdMessage;
