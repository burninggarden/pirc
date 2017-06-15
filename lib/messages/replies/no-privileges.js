
var
	extend                = req('/lib/utilities/extend'),
	ReplyMessage          = req('/lib/messages/reply'),
	Replies               = req('/lib/constants/replies'),
	PermissionDeniedError = req('/lib/errors/permission-denied');


class NoPrivilegesMessage extends ReplyMessage {

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
		return new PermissionDeniedError(this.getBody());
	}

}

extend(NoPrivilegesMessage.prototype, {

	reply: Replies.ERR_NOPRIVILEGES,
	body:  ''

});

module.exports = NoPrivilegesMessage;
