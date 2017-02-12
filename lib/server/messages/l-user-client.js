var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

var
	NotYetImplementedError = req('/lib/errors/not-yet-implemented');


class ServerLUserClientMessage extends ServerMessage {

	serializeParams() {
		throw new NotYetImplementedError(
			'ServerLUserClientMessage::serializeParams'
		);
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerLUserClientMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSERCLIENT

});

module.exports = ServerLUserClientMessage;
