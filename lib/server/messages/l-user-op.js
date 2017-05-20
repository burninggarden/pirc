
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class ServerLUserOpMessage extends ServerMessage {

	getLocalOperatorCount() {
		return this.getLocalServerDetails().getOperatorCount();
	}

	setRemoteOperatorCount(operator_count) {
		this.getRemoteServerDetails().setOperatorCount(operator_count);
	}

	getRemoteOperatorCount() {
		return this.getRemoteServerDetails().getOperatorCount();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setRemoteOperatorCount(parseInt(middle_params.pop()));
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			operator_count = this.getLocalOperatorCount(),
			body           = this.getBody();

		return `${operator_count} :${body}`;
	}

}

extend(ServerLUserOpMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSEROP,
	body:          'IRC Operators online'

});

module.exports = ServerLUserOpMessage;
