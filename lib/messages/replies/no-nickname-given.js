
var
	extend           = req('/lib/utilities/extend'),
	ReplyMessage     = req('/lib/messages/reply'),
	Replies          = req('/lib/constants/replies'),
	InvalidNickError = req('/lib/errors/invalid-nick'),
	ErrorReasons     = req('/lib/constants/error-reasons');


class NoNicknameGivenMessage extends ReplyMessage {

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());
		this.setBody(trailing_parameter);
	}

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		return `${targets} :${body}`;
	}

	toError() {
		return new InvalidNickError(
			undefined,
			ErrorReasons.OMITTED
		);
	}

}

extend(NoNicknameGivenMessage.prototype, {

	reply: Replies.ERR_NONICKNAMEGIVEN,
	body:  'No nickname given'

});

module.exports = NoNicknameGivenMessage;
