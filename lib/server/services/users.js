var
	Service  = req('/lib/server/service'),
	Commands = req('/constants/commands');

class UserService extends Service {

	registerClient() {
		// Deliberately a noop
	}

	unregisterClient() {
		// Deliberately a noop
	}

	handleClientUserMessage(client, message) {
		var
			username     = message.getUsername(),
			realname     = message.getRealname(),
			modes        = message.getModes(),
			user_details = client.getUserDetails();

		user_details.setUsername(username);
		user_details.setRealname(realname);

		modes.forEach(user_details.addMode, client);
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.USER:
				return this.handleClientUserMessage(client, message);

			default:
				throw new Error(`Invalid command: ${command}`);
		}
	}

}

module.exports = UserService;
