
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class GlobalUsersMessage extends ReplyMessage {

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

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setRemoteCurrentGlobalUserCount(parseInt(middle_parameters[0]));
		this.setRemoteMaxGlobalUserCount(parseInt(middle_parameters[1]));
		this.setBody(trailing_parameter);
	}

	serializeParameters() {
		var
			current_users = this.getLocalCurrentGlobalUserCount(),
			max_users     = this.getLocalMaxGlobalUserCount(),
			body          = `Current global users ${current_users}, max ${max_users}`;

		return `${current_users} ${max_users} :${body}`;
	}

}

extend(GlobalUsersMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_GLOBALUSERS

});

module.exports = ServerGlobalUsersMessage;
