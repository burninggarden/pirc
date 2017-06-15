
var
	extend                 = req('/lib/utilities/extend'),
	ReplyMessage           = req('/lib/messages/reply'),
	Replies                = req('/lib/constants/replies'),
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');


class NotImplementedMessage extends ReplyMessage {

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			body    = this.trimBody(this.getBody());

		return `${targets} :Not yet implemented: ${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());

		this.setBody(this.trimBody(trailing_parameter));
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

extend(NotImplementedMessage.prototype, {
	reply: Replies.ERR_NOTIMPLEMENTED
});

module.exports = NotImplementedMessage;
