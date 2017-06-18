
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class GlobalUsersMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			user_count: [
				this.getCurrentGlobalUserCount(),
				this.getMaxGlobalUserCount(),
				this.getCurrentGlobalUserCount(),
				this.getMaxGlobalUserCount()
			]
		};
	}

	setValuesFromParameters(parameters) {
		this.setCurrentGlobalUserCount(parameters.getNext('user_count'));
		this.setMaxGlobalUserCount(parameters.getNext('user_count'));
	}

}

extend(GlobalUsersMessage.prototype, {

	reply: Replies.RPL_GLOBALUSERS

});

module.exports = GlobalUsersMessage;
