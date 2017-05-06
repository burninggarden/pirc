
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLUserOpMessage extends ServerMessage {

	getOperatorCount() {
		return this.getLocalServerDetails().getOperatorCount();
	}

	setOperatorCount(operator_count) {
		this.getRemoteServerDetails().setOperatorCount(operator_count);
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setOperatorCount(parseInt(middle_params.pop()));
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			operator_count = this.getOperatorCount(),
			body           = this.getBody();

		return `${operator_count} :${body}`;
	}

}

extend(ServerLUserOpMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSEROP,
	body:          'IRC Operators online'

});

module.exports = ServerLUserOpMessage;
