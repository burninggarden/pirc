
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class ServerEndOfMotdMessage extends ServerMessage {

	serializeParameters() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(ServerEndOfMotdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ENDOFMOTD,
	body:          'End of /MOTD command'

});

module.exports = ServerEndOfMotdMessage;
