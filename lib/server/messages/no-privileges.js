
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class NoPrivilegesMessage extends ServerMessage {

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		return `${targets} :${body}`;
	}

}

extend(NoPrivilegesMessage.prototype, {

	reply_numeric: ReplyNumerics.ERR_NOPRIVILEGES,
	body:          ''

});

module.exports = NoPrivilegesMessage;
