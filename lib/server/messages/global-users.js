
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerGlobalUsersMessage extends ServerMessage {

	/**
	 * Called on the client when processing the message.
	 *
	 * @param   {int} user_count
	 * @returns {void}
	 */
	setRemoteCurrentGlobalUserCount(user_count) {
		this.getRemoteServerDetails().setCurrentGlobalUserCount(user_count);
	}

	getRemoteCurrentGlobalUserCount() {
		return this.getRemoteServerDetails().getCurrentGlobalUserCount();
	}

	/**
	 * Called on the client when processing the message.
	 *
	 * @param   {int} user_count
	 * @returns {void}
	 */
	setRemoteMaxGlobalUserCount(user_count) {
		this.getRemoteServerDetails().setMaxGlobalUserCount(user_count);
	}

	getRemoteMaxGlobalUserCount() {
		return this.getRemoteServerDetails().getMaxGlobalUserCount();
	}

	/**
	 * Called on the server when preparing the message to be sent.
	 *
	 * @returns {int}
	 */
	getLocalCurrentGlobalUserCount() {
		return this.getLocalServerDetails().getCurrentGlobalUserCount();
	}

	/**
	 * Called on the server when preparing the message to be sent.
	 *
	 * @returns {int}
	 */
	getLocalMaxGlobalUserCount() {
		return this.getLocalServerDetails().getMaxGlobalUserCount();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setRemoteCurrentGlobalUserCount(parseInt(middle_params[0]));
		this.setRemoteMaxGlobalUserCount(parseInt(middle_params[1]));
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			current_users = this.getLocalCurrentGlobalUserCount(),
			max_users     = this.getLocalMaxGlobalUserCount(),
			body          = `Current global users ${current_users}, max ${max_users}`;

		return `${current_users} ${max_users} :${body}`;
	}

}

extend(ServerGlobalUsersMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_GLOBALUSERS

});

module.exports = ServerGlobalUsersMessage;
