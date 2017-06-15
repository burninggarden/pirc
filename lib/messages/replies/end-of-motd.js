
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class EndOfMotdMessage extends ReplyMessage {

	serializeParameters() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(EndOfMotdMessage.prototype, {

	reply: Replies.RPL_ENDOFMOTD,
	body:  'End of /MOTD command'

});

module.exports = EndOfMotdMessage;
