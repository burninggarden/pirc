
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerGlobalUsersMessage extends ServerMessage {

	setCurrentGlobalUserCount(user_count) {
		this.getServerDetails().setCurrentGlobalUserCount(user_count);
	}

	getCurrentGlobalUserCount() {
		return this.getServerDetails().getCurrentGlobalUserCount();
	}

	setMaxGlobalUserCount(user_count) {
		this.getServerDetails().setMaxGlobalUserCount(user_count);
	}

	getMaxGlobalUserCount() {
		return this.getServerDetails().getMaxGlobalUserCount();
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
