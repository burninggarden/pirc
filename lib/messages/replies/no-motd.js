
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class NoMotdMessage extends ReplyMessage {

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

extend(NoMotdMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOMOTD,
	body:          'MOTD File is missing'
});

module.exports = NoMotdMessage;
