
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class ServerNoMotdMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

	serializeParameters() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(ServerNoMotdMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOMOTD,
	body:          'MOTD File is missing'
});

module.exports = ServerNoMotdMessage;
