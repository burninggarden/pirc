
var
	extend = req('/utilities/extend');

var
	ClientEvent = req('/lib/client/event');


class ClientMessageEvent extends ClientEvent {

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

	hasNick() {
		if (!this.hasUser()) {
			return false;
		}

		var user = this.getUser();

		return user.hasNick();
	}

	getNick() {
		return this.getUser().getNick();
	}

	getMessage() {
		return this.message;
	}

	getBody() {
		return this.getMessage().getBody();
	}

}

extend(ClientMessageEvent.prototype, {
	message: null,
	channel: null,
	user:    null
});

module.exports = ClientMessageEvent;
