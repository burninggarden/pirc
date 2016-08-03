var req = require('req');

var Service = req('/lib/server/service');

class UserService extends Service {

	registerClient() {
		// Deliberately a noop
	}

	unregisterClient() {
		// Deliberately a noop
	}

	handleClientMessage(client, message) {
		var
			username = message.getUsername(),
			realname = message.getRealname(),
			modes    = message.getModes();

		client.setUsername(username);
		client.setRealname(realname);

		modes.forEach(client.addMode, client);
	}

}

module.exports = UserService;
