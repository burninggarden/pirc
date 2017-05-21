
var
	extend                 = req('/lib/utilities/extend'),
	ServerMessage          = req('/lib/server/message'),
	ReplyNumerics          = req('/lib/constants/reply-numerics'),
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');


class ServerNotImplementedMessage extends ServerMessage {

	serializeParams() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		return `${targets} :Not yet implemented: ${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());

		var body_leader = 'Not yet implemented: ';

		if (trailing_param.indexOf(body_leader) === 0) {
			trailing_param = trailing_param.slice(body_leader.length);
		}

		this.setBody(trailing_param);
	}

	toError() {
		return new NotYetImplementedError(this.getBody());
	}

}

extend(ServerNotImplementedMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOTIMPLEMENTED
});

module.exports = ServerNotImplementedMessage;
