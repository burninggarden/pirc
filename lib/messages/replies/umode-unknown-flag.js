
var
	extend           = req('/lib/utilities/extend'),
	ReplyMessage     = req('/lib/messages/reply'),
	Replies          = req('/lib/constants/replies'),
	InvalidModeError = req('/lib/errors/invalid-mode'),
	ErrorReasons     = req('/lib/constants/error-reasons');


class UModeUnknownFlagMessage extends ReplyMessage {

	setMode(mode) {
		this.mode = mode;
	}

	getMode() {
		return this.mode;
	}

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			mode    = this.getMode(),
			body    = this.getBody();

		return `${targets} ${mode} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());
		this.setMode(middle_parameters.shift());
		this.setBody(trailing_parameter);
	}

	toError() {
		return new InvalidModeError(
			this.getMode(),
			ErrorReasons.UNKNOWN_TYPE
		);
	}

}

extend(UModeUnknownFlagMessage.prototype, {
	reply: Replies.ERR_UMODEUNKNOWNFLAG,
	body:  'is unknown mode char to me',
	mode:  null
});

module.exports = UModeUnknownFlagMessage;
