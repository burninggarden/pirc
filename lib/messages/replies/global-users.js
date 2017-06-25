
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class GlobalUsersMessage extends ReplyMessage {

	getUserCount() {
		return this.user_count;
	}

	setUserCount(user_count) {
		this.user_count = user_count;
		return this;
	}

	getMaxUserCount() {
		return this.max_user_count;
	}

	setMaxUserCount(max_user_count) {
		this.max_user_count = max_user_count;
		return this;
	}

	getValuesForParameters() {
		return {
			user_count: [
				this.getUserCount(),
				this.getMaxUserCount(),
				this.getUserCount(),
				this.getMaxUserCount()
			]
		};
	}

	setValuesFromParameters(parameters) {
		this.setUserCount(parameters.getNext('user_count'));
		this.setMaxUserCount(parameters.getNext('user_count'));
	}

}

extend(GlobalUsersMessage.prototype, {

	reply:          Replies.RPL_GLOBALUSERS,
	abnf:           '<user-count> " " <user-count> " :Current global users " <user-count> ", max " <user-count>',
	user_count:     null,
	max_user_count: null

});

module.exports = GlobalUsersMessage;
