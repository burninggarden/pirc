var req = require('req');

var
	InvalidClientMessageError = req('/lib/errors/invalid-client-message'),
	NotConnectedError         = req('/lib/errors/not-connected');

var
	ClientPasswordMessage = req('/lib/client/messages/password'),
	ClientNickMessage     = req('/lib/client/messages/nick'),
	ClientUserMessage     = req('/lib/client/messages/user');

var
	ClientMessage = req('/lib/client/message'),
	ErrorReasons  = req('/constants/error-reasons');



module.exports = {

	init() {
		// Deliberately a noop for the time being.
	},

	write(message) {
		var parts = message.split('\r\n').filter(function filter(part) {
			return part.length > 0;
		});

		console.log('>> ' + parts.join(''));

		this.socket.write(message);
	},

	sendMessage(message) {
		if (!(message instanceof ClientMessage)) {
			throw new InvalidClientMessageError(message, ErrorReasons.UNKNOWN_TYPE);
		}

		if (!this.isConnected()) {
			throw new NotConnectedError();
		}

		this.write(message.serialize());
	},

	sendRegistrationMessages() {
		// If a password is specified, it should be sent before the
		// nick or user messages.
		if (this.password) {
			let password_message = new ClientPasswordMessage();

			password_message.setPassword(this.password);

			this.sendMessage(password_message);
		}

		var nick_message = new ClientNickMessage();

		nick_message.setDesiredNick(this.nick);

		this.sendMessage(nick_message);

		var user_message = new ClientUserMessage();

		user_message.setUsername(this.username)
		            .setRealname(this.realname)
					.setModes(this.modes);

		this.sendMessage(user_message);
	}

};
