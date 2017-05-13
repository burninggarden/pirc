
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLUserUnknownMessage extends ServerMessage {

	getLocalUnknownUserCount() {
		return this.getLocalServerDetails().getUnknownUserCount();
	}

	setRemoteUnknownUserCount(unknown_user_count) {
		this.getRemoteServerDetails().setUnknownUserCount(unknown_user_count);
	}

	getRemoteUnknownUserCount() {
		return this.getRemoteServerDetails().getUnknownUserCount();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setRemoteUnknownUserCount(parseInt(middle_params.pop()));
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			unknown_user_count = this.getLocalUnknownUserCount(),
			body               = this.getBody();

		return `${unknown_user_count} :${body}`;
	}

}

extend(ServerLUserUnknownMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LUSERUNKNOWN,
	body:          'unknown connection(s)'

});

module.exports = ServerLUserUnknownMessage;
