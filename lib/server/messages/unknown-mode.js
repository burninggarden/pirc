
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerUnknownModeMessage extends ServerMessage {

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

}

extend(ServerUnknownModeMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_UNKNOWNMODE,
	body:          'Unrecogized mode',
	mode:          null
});

module.exports = ServerUnknownModeMessage;
