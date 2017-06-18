
var
	extend                = req('/lib/utilities/extend'),
	ReplyMessage          = req('/lib/messages/reply'),
	Replies               = req('/lib/constants/replies'),
	PermissionDeniedError = req('/lib/errors/permission-denied');


class NoPrivilegesMessage extends ReplyMessage {

	getValuesForParameters() {
		return { };
	}

	setValuesFromParameters() {
		// Deliberately a noop.
	}

	toError() {
		return new PermissionDeniedError(this.getBody());
	}

}

extend(NoPrivilegesMessage.prototype, {

	reply: Replies.ERR_NOPRIVILEGES

});

module.exports = NoPrivilegesMessage;
