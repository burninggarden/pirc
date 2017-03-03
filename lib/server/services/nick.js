var
	extend = req('/utilities/extend');

var
	Service       = req('/lib/server/service'),
	Commands      = req('/constants/commands'),
	ServiceTypes  = req('/constants/service-types'),
	ErrorReasons  = req('/constants/error-reasons'),
	NickValidator = req('/validators/nick');

var
	NicknameInUseMessage     = req('/lib/server/messages/nickname-in-use'),
	ServerNickMessage        = req('/lib/server/messages/nick'),
	ErroneousNicknameMessage = req('/lib/server/messages/erroneous-nickname');

var
	InvalidNickError = req('/lib/errors/invalid-nick');


class NickService extends Service {

	constructor() {
		super();
		this.nicks_to_clients = { };
	}

	registerClient(client, callback) {
		var nick = client.getUserDetails().getNick();

		if (this.hasClientForNick(nick)) {
			this.sendNicknameInUseMessageToClientForNick(client, nick);

			let error = new InvalidNickError(nick, ErrorReasons.ALREADY_IN_USE);

			return void callback(error);
		}

		return void callback(null);
	}

	coupleToClient(client) {
		var user_details = client.getUserDetails();

		if (user_details.hasNick()) {
			this.setClientForNick(client, user_details.getNick());
		}
	}

	decoupleFromClient(client) {
		var user_details = client.getUserDetails();

		if (user_details.hasNick()) {
			delete this.nicks_to_clients[user_details.getNick()];
		}
	}

	getClientForNick(nick) {
		return this.nicks_to_clients[nick];
	}

	setClientForNick(client, nick) {
		this.nicks_to_clients[nick] = client;
	}

	hasClientForNick(nick) {
		return this.getClientForNick(nick) !== undefined;
	}

	handleClientNickMessage(client, message) {
		var
			nick            = message.getDesiredNick(),
			existing_client = this.getClientForNick(nick);

		if (existing_client === client) {
			// TODO: figure out what to do here...
			throw new Error('implement');
		}

		if (existing_client !== undefined) {
			return void this.sendNicknameInUseMessageToClientForNick(
				client,
				nick
			);
		}

		try {
			NickValidator.validate(nick);
		} catch (error) {
			if (!(error instanceof InvalidNickError)) {
				throw error;
			}

			var reason = error.getReason();

			switch (reason) {
				case ErrorReasons.INVALID_CHARACTERS:
				case ErrorReasons.OVER_MAXIMUM_LENGTH:
					return this.sendErroneousNicknameMessageToClientForNick(
						client,
						nick
					);

				default:
					throw error;
			}
		}

		this.getObserversForClient(client).forEach(function each(observer) {
			this.forwardNickMessageToClient(message, observer);
		}, this);

		client.getUserDetails().setNick(nick);
	}

	forwardNickMessageToClient(message, client) {
		var outbound_message = ServerNickMessage.fromInboundMessage(message);

		client.sendMessage(outbound_message);
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.NICK:
				return this.handleClientNickMessage(client, message);

			default:
				throw new Error(`Invalid command: ${command}`);
		}
	}

	sendNicknameInUseMessageToClientForNick(client, nick) {
		var message = new NicknameInUseMessage();

		message.setNick(nick);

		return void client.sendMessage(message);
	}

	sendErroneousNicknameMessageToClientForNick(client, nick) {
		var message = new ErroneousNicknameMessage();

		message.setNick(nick);

		return void client.sendMessage(message);
	}

}

extend(NickService.prototype, {
	type:             ServiceTypes.NICK,
	nicks_to_clients: null
});

module.exports = NickService;
