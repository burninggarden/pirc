
var
	extend           = req('/lib/utilities/extend'),
	ServerMessage    = req('/lib/server/message'),
	ReplyNumerics    = req('/lib/constants/reply-numerics'),
	InvalidModeError = req('/lib/errors/invalid-mode'),
	ErrorReasons     = req('/lib/constants/error-reasons');


class ServerUnknownModeMessage extends ServerMessage {

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

extend(ServerUnknownModeMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_UNKNOWNMODE,
	body:          'is unknown mode char to me',
	mode:          null
});

module.exports = ServerUnknownModeMessage;
