
var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerGlobalUsersMessage extends ServerMessage {

	setCurrentUserCount(current_user_count) {
		this.current_user_count = current_user_count;
	}

	getCurrentUserCount() {
		return this.current_user_count;
	}

	setMaxUserCount(max_user_count) {
		this.max_user_count = max_user_count;
	}

	getMaxUserCount() {
		return this.max_user_count;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setCurrentUserCount(parseInt(middle_params[0]));
		this.setMaxUserCount(parseInt(middle_params[1]));
		this.setBody(trailing_param);
	}

	serializeParams() {
		var
			current_users = this.getCurrentUserCount(),
			max_users     = this.getMaxUserCount(),
			body          = `Current global users ${current_users}, max ${max_users}`;

		return `${current_users} ${max_users} :${body}`;
	}

}

extend(ServerGlobalUsersMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_GLOBALUSERS

});

module.exports = ServerGlobalUsersMessage;
