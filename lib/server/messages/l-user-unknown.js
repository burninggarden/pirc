
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLUserUnknownMessage extends ServerMessage {

	getUnknownUserCount() {
		return this.getLocalServerDetails().getUnknownUserCount();
	}

	setUnknownUserCount(unknown_user_count) {
		this.getRemoteServerDetails().setUnknownUserCount(unknown_user_count);
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setUnknownUserCount(parseInt(middle_params.pop()));
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			unknown_user_count = this.getUnknownUserCount(),
			body               = this.getBody();

		return `${unknown_user_count} :${body}`;
	}

}

extend(ServerLUserUnknownMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSERUNKNOWN,
	body:          'unknown connection(s)'

});

module.exports = ServerLUserUnknownMessage;
