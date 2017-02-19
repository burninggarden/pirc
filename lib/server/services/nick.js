var
	extend = req('/utilities/extend');

var
	Service      = req('/lib/server/service'),
	Commands     = req('/constants/commands'),
	ServiceTypes = req('/constants/service-types'),
	ErrorReasons = req('/constants/error-reasons');

var
	NicknameInUseMessage = req('/lib/server/messages/nickname-in-use'),
	InvalidNickError     = req('/lib/errors/invalid-nick');


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
			return;
		}

		if (existing_client !== undefined) {
			return void this.sendNicknameInUseMessageToClientForNick(
				client,
				nick
			);
		}

		client.setNick(nick);
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
		var message = new NicknameInUseMessage(nick);

		return void client.sendMessage(message);
	}

}

extend(NickService.prototype, {
	type:             ServiceTypes.NICK,
	nicks_to_clients: null
});

module.exports = NickService;
