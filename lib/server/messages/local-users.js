
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class ServerLocalUsersMessage extends ServerMessage {

	getLocalCurrentUserCount() {
		return this.getLocalServerDetails().getCurrentLocalUserCount();
	}

	getLocalMaxUserCount() {
		return this.getLocalServerDetails().getMaxLocalUserCount();
	}

	setRemoteCurrentUserCount(user_count) {
		this.getRemoteServerDetails().setCurrentLocalUserCount(user_count);
	}

	getRemoteCurrentUserCount() {
		this.getRemoteServerDetails().getCurrentLocalUserCount();
	}

	setRemoteMaxUserCount(user_count) {
		this.getRemoteServerDetails().setMaxLocalUserCount(user_count);
	}

	getRemoteMaxUserCount() {
		return this.getRemoteServerDetails().getMaxLocalUserCount();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setRemoteCurrentUserCount(parseInt(middle_params[0]));
		this.setRemoteMaxUserCount(parseInt(middle_params[1]));
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			current_users = this.getLocalCurrentUserCount(),
			max_users     = this.getLocalMaxUserCount(),
			body          = `Current local users ${current_users}, max ${max_users}`;

		return `${current_users} ${max_users} :${body}`;
	}

}

extend(ServerLocalUsersMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LOCALUSERS

});

module.exports = ServerLocalUsersMessage;
