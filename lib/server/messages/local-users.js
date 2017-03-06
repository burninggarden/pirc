
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerLocalUsersMessage extends ServerMessage {

	setCurrentLocalUserCount(user_count) {
		this.getServerDetails().setCurrentLocalUserCount(user_count);
	}

	getCurrentLocalUserCount() {
		return this.getServerDetails().getCurrentLocalUserCount();
	}

	setMaxLocalUserCount(user_count) {
		this.getServerDetails().setMaxLocalUserCount(user_count);
	}

	getMaxLocalUserCount() {
		return this.getServerDetails().getMaxLocalUserCount();
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
