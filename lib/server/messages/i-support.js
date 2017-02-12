var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerISupportMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

	getSupportString() {
		// TODO: this
		return '';
	}

	setSupportPairs() {
		// TODO: this
	}

	serializeParams() {
		var
			targets        = this.serializeTargets(),
			support_string = this.getSupportString(),
			body           = this.getBody();

		return `${targets} ${support_string} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setSupportPairs(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerISupportMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_ISUPPORT,
	body:          'are supported by this server'

});

module.exports = ServerISupportMessage;
