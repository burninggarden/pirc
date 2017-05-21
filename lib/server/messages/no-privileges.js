
var
	extend                = req('/lib/utilities/extend'),
	ServerMessage         = req('/lib/server/message'),
	ReplyNumerics         = req('/lib/constants/reply-numerics'),
	PermissionDeniedError = req('/lib/errors/permission-denied');


class NoPrivilegesMessage extends ServerMessage {

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

	reply_numeric: ReplyNumerics.ERR_NOPRIVILEGES,
	body:          ''

});

module.exports = NoPrivilegesMessage;
