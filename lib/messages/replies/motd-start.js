
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class MotdStartMessage extends ReplyMessage {

	getBody() {
		var server_identifier = this.getLocalServerIdentifier();

		return `- ${server_identifier} Message of the day -`;
	}

	serializeParameters() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(MotdStartMessage.prototype, {

	reply: Replies.RPL_MOTDSTART

});

module.exports = MotdStartMessage;
