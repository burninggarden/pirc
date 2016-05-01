var req = require('req');

var
	InvalidClientMessageError = req('/lib/errors/invalid-client-message'),
	NotConnectedError         = req('/lib/errors/not-connected');

var
	ClientPasswordMessage = req('/lib/messages/client/password'),
	ClientNickMessage     = req('/lib/messages/client/nick'),
	ClientUserMessage     = req('/lib/messages/client/user');

var
	ClientMessage    = req('/lib/messages/client'),
	CharacterClasses = req('/constants/character-classes'),
	ErrorReasons     = req('/constants/error-reasons');



module.exports = {

	write(message) {
		console.log('outgoing:');
		console.log(message);
		console.log(' ');
		this.socket.write(message);
	},

	sendMessage(message) {
		if (!(message instanceof ClientMessage)) {
			throw new InvalidClientMessageError(message, ErrorReasons.UNKNOWN_TYPE);
		}

		if (!this.isConnected()) {
			throw new NotConnectedError();
		}

		this.write(message.serialize() + CharacterClasses.MESSAGE_SUFFIX);
	},

	sendRegistrationMessages() {
		// If a password is specified, it should be sent before the
		// nick or user messages.
		if (this.password) {
			this.sendMessage(new ClientPasswordMessage(this.password));
		}

		this.sendMessage(new ClientNickMessage(this.nick));

		var user_message = new ClientUserMessage(
			this.username,
			this.realname,
			this.modes
		);

		this.sendMessage(user_message);
	}

};
