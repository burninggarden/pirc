
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerGlobalUsersMessage extends ServerMessage {

	/**
	 * Called on the client when processing the message.
	 */
	setCurrentGlobalUserCount(user_count) {
		this.getRemoteServerDetails().setCurrentGlobalUserCount(user_count);
	}

	/**
	 * Called on the client when processing the message.
	 */
	setMaxGlobalUserCount(user_count) {
		this.getRemoteServerDetails().setMaxGlobalUserCount(user_count);
	}

	/**
	 * Called on the server when preparing the message to be sent.
	 */
	getCurrentGlobalUserCount() {
		return this.getLocalServerDetails().getCurrentGlobalUserCount();
	}

	/**
	 * Called on the server when preparing the message to be sent.
	 */
	getMaxGlobalUserCount() {
		return this.getLocalServerDetails().getMaxGlobalUserCount();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setCurrentGlobalUserCount(parseInt(middle_params[0]));
		this.setMaxGlobalUserCount(parseInt(middle_params[1]));
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			current_users = this.getCurrentGlobalUserCount(),
			max_users     = this.getMaxGlobalUserCount(),
			body          = `Current global users ${current_users}, max ${max_users}`;

		return `${current_users} ${max_users} :${body}`;
	}

}

extend(ServerGlobalUsersMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_GLOBALUSERS

});

module.exports = ServerGlobalUsersMessage;
