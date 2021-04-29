
var
	extend = require('../../utility/extend');

var
	Client_Event = require('../event');


class Client_Event_Message extends Client_Event {

	setMessage(message) {
		this.message = message;
	}

	setChannel(channel) {
		this.channel = channel;
	}

	getChannel() {
		return this.channel;
	}

	hasChannel() {
		return this.getChannel() !== null;
	}

	getChannelName() {
		return this.getChannel().getName();
	}

	setUser(user) {
		this.user = user;
	}

	getUser() {
		return this.user;
	}

	hasUser() {
		return this.getUser() !== null;
	}

	hasNickname() {
		if (!this.hasUser()) {
			return false;
		}

		var user = this.getUser();

		return user.hasNickname();
	}

	getNickname() {
		return this.getUser().getNickname();
	}

	getMessage() {
		return this.message;
	}

	getBody() {
		return this.getMessage().getMessageBody();
	}

}

extend(Client_Event_Message.prototype, {
	message: null,
	channel: null,
	user:    null
});

module.exports = Client_Event_Message;
