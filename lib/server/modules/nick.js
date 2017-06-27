var
	extend = req('/lib/utilities/extend');

var
	Module            = req('/lib/server/module'),
	Commands          = req('/lib/constants/commands'),
	ModuleTypes       = req('/lib/constants/module-types'),
	ErrorReasons      = req('/lib/constants/error-reasons'),
	NicknameValidator = req('/lib/validators/nickname');

var
	NicknameInUseMessage     = req('/lib/messages/replies/nickname-in-use'),
	ErroneousNicknameMessage = req('/lib/messages/replies/erroneous-nickname'),
	NoNicknameGivenMessage   = req('/lib/messages/replies/no-nickname-given');

var
	InvalidNicknameError = req('/lib/errors/invalid-nickname');


class NickModule extends Module {

	constructor() {
		super();
		this.nicknames_to_clients = { };
	}

	registerClient(client, callback) {
		var nickname = client.getUserDetails().getNickname();

		if (this.hasClientForNickname(nickname)) {
			this.sendNicknameInUseMessageToClientForNickname(client, nickname);

			let error = new InvalidNicknameError(
				nickname,
				ErrorReasons.ALREADY_IN_USE
			);

			return void callback(error);
		}

		return void callback(null);
	}

	coupleToClient(client) {
		var user_details = client.getUserDetails();

		if (user_details.hasNickname()) {
			this.setClientForNickname(client, user_details.getNickname());
		}
	}

	decoupleFromClient(client) {
		var user_details = client.getUserDetails();

		if (user_details.hasNickname()) {
			delete this.nicknames_to_clients[user_details.getNickname()];
		}
	}

	getClientForNickname(nickname) {
		return this.nicknames_to_clients[nickname];
	}

	setClientForNickname(client, nickname) {
		this.nicknames_to_clients[nickname] = client;
	}

	hasClientForNickname(nickname) {
		return this.getClientForNickname(nickname) !== undefined;
	}

	handleClientNickMessage(client, message) {
		var
			nickname        = message.getNickname(),
			existing_client = this.getClientForNickname(nickname);

		if (existing_client === client) {
			// TODO: figure out what to do here...
			throw new Error('implement');
		}

		if (existing_client !== undefined) {
			return void this.sendNicknameInUseMessageToClientForNickname(
				client,
				nickname
			);
		}

		try {
			NicknameValidator.validate(nickname);
		} catch (error) {
			if (!(error instanceof InvalidNicknameError)) {
				throw error;
			}

			var reason = error.getReason();

			switch (reason) {
				case ErrorReasons.INVALID_CHARACTERS:
				case ErrorReasons.OVER_MAXIMUM_LENGTH:
					return this.sendErroneousNicknameMessageToClientForNickname(
						client,
						nickname
					);

				case ErrorReasons.OMITTED:
					return this.sendNoNicknameGivenMessageToClient(client);

				default:
					throw error;
			}
		}

		this.getObserversForClient(client).forEach(function each(observer) {
			observer.sendMessage(message);
		}, this);

		client.getUserDetails().setNickname(nickname);
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

	sendNoNicknameGivenMessageToClient(client) {
		var message = new NoNicknameGivenMessage();

		return void client.sendMessage(message);
	}

	sendNicknameInUseMessageToClientForNickname(client, nickname) {
		var message = new NicknameInUseMessage();

		message.setNickname(nickname);

		return void client.sendMessage(message);
	}

	sendErroneousNicknameMessageToClientForNickname(client, nickname) {
		var message = new ErroneousNicknameMessage();

		message.setNickname(nickname);

		return void client.sendMessage(message);
	}

}

extend(NickModule.prototype, {
	type:                 ModuleTypes.NICK,
	nicknames_to_clients: null
});

module.exports = NickModule;
