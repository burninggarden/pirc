
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class LocalUsersMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			user_count: [
				this.getCurrentLocalUserCount(),
				this.getMaxLocalUserCount(),
				this.getCurrentlocalUserCount(),
				this.getMaxLocalUserCount()
			]
		};
	}

	setValuesFromParameters(parameters) {
		this.setCurrentLocalUserCount(parameters.getNext('user_count'));
		this.setMaxLocalUserCount(parameters.getNext('user_count'));
	}

}

extend(LocalUsersMessage.prototype, {

	reply: Replies.RPL_LOCALUSERS

});

module.exports = LocalUsersMessage;
