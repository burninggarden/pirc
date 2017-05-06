
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLocalUsersMessage extends ServerMessage {

	getCurrentLocalUserCount() {
		return this.getLocalServerDetails().getCurrentLocalUserCount();
	}

	getMaxLocalUserCount() {
		return this.getLocalServerDetails().getMaxLocalUserCount();
	}

	setCurrentLocalUserCount(user_count) {
		this.getRemoteServerDetails().setCurrentLocalUserCount(user_count);
	}

	setMaxLocalUserCount(user_count) {
		this.getRemoteServerDetails().setMaxLocalUserCount(user_count);
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setCurrentLocalUserCount(parseInt(middle_params[0]));
		this.setMaxLocalUserCount(parseInt(middle_params[1]));
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			current_users = this.getCurrentLocalUserCount(),
			max_users     = this.getMaxLocalUserCount(),
			body          = `Current local users ${current_users}, max ${max_users}`;

		return `${current_users} ${max_users} :${body}`;
	}

}

extend(ServerLocalUsersMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_LOCALUSERS

});

module.exports = ServerLocalUsersMessage;
