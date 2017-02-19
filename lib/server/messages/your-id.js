var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerYourIdMessage extends ServerMessage {

	serializeParams() {
		var
			targets = this.serializeTargets(),
			id      = this.getId(),
			body    = this.getBody();

		return `${targets} ${id} :${body}`;
	}

	setId(id) {
		this.getTargetUserDetails().setUniqueId(id);
	}

	getId() {
		return this.getTargetUserDetails().getUniqueId();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setId(middle_params.shift());
		this.setBody(trailing_param);
	}

}

extend(ServerYourIdMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_YOURID,
	body:          'your unique ID'

});

module.exports = ServerYourIdMessage;
