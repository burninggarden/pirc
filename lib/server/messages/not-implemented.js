
var
	extend                 = req('/lib/utilities/extend'),
	ServerMessage          = req('/lib/server/message'),
	ReplyNumerics          = req('/lib/constants/reply-numerics'),
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');


class ServerNotImplementedMessage extends ServerMessage {

	serializeParams() {
		var
			targets = this.serializeTargets(),
			body    = this.trimBody(this.getBody());

		return `${targets} :Not yet implemented: ${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());

		this.setBody(this.trimBody(trailing_param));
	}

	trimBody(body) {
		var body_leader = 'Not yet implemented: ';

		if (body.indexOf(body_leader) === 0) {
			body = body.slice(body_leader.length);
		}

		return body;
	}

	toError() {
		return new NotYetImplementedError(this.trimBody(this.getBody()));
	}

}

extend(ServerNotImplementedMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_NOTIMPLEMENTED
});

module.exports = ServerNotImplementedMessage;
