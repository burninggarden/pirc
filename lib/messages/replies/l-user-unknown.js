
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

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

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setRemoteUnknownUserCount(parseInt(middle_parameters.pop()));
		this.setBody(trailing_parameter);
	}

	serializeParameters() {
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
