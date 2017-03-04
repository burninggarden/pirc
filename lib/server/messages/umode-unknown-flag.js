
var
	extend           = req('/utilities/extend'),
	ServerMessage    = req('/lib/server/message'),
	ReplyNumerics    = req('/constants/reply-numerics'),
	InvalidModeError = req('/lib/errors/invalid-mode'),
	ErrorReasons     = req('/constants/error-reasons');


class ServerUModeUnknownFlagMessage extends ServerMessage {

	setMode(mode) {
		this.mode = mode;
	}

	getMode() {
		return this.mode;
	}

	serializeParams() {
		var
			targets = this.serializeTargets(),
			mode    = this.getMode(),
			body    = this.getBody();

		return `${targets} ${mode} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setMode(middle_params.shift());
		this.setBody(trailing_param);
	}

	toError() {
		return new InvalidModeError(
			this.getMode(),
			ErrorReasons.UNKNOWN_TYPE
		);
	}

}

extend(ServerUModeUnknownFlagMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_UMODEUNKNOWNFLAG,
	body:          'is unknown mode char to me',
	mode:          null
});

module.exports = ServerUModeUnknownFlagMessage;
