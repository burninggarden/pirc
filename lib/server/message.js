var req = require('req');

var
	extend  = req('/utilities/extend'),
	Message = req('/lib/message');


class ServerMessage extends Message {

	isFromServer() {
		return true;
	}

	serializeParams() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerMessage.prototype, {
	prefix:      null,
	target_nick: null
});

module.exports = ServerMessage;
