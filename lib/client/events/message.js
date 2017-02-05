
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

	setClient(client) {
		this.client = client;
	}

	getClient() {
		return this.client;
	}

	hasClient() {
		return this.getClient() !== null;
	}

	hasNick() {
		if (!this.hasClient()) {
			return false;
		}

		var client = this.getClient();

		return client.hasNick();
	}

	getNick() {
		return this.getClient().getNick();
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
	client:  null
});

module.exports = ClientMessageEvent;
