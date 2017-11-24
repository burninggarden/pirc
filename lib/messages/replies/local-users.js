
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Enum_Replies = req('/lib/enum/replies');

class LocalUsersMessage extends ReplyMessage {

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

	setMaxUserCount(user_count) {
		this.max_user_count = user_count;
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

extend(LocalUsersMessage.prototype, {

	reply:          Enum_Replies.RPL_LOCALUSERS,
	abnf:           '<user-count> " " <user-count> " :Current local users " <user-count> ", max " <user-count>',
	user_count:     null,
	max_user_count: null

});

module.exports = LocalUsersMessage;
