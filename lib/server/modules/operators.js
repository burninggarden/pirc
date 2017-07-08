
var
	extend      = req('/lib/utilities/extend'),
	Module      = req('/lib/server/module'),
	Commands    = req('/lib/constants/commands'),
	Replies     = req('/lib/constants/replies'),
	ModuleTypes = req('/lib/constants/module-types');

var
	YouAreOperatorMessage = req('/lib/messages/replies/you-are-operator');


class OperatorModule extends Module {

	coupleToClient() {
		// Noop by default.
	}

	decoupleFromClient() {
		// Noop for now.
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.OPER:
				return this.handleClientOperMessage(client, message);

			default:
				throw new Error('Invalid command: ' + command);
		}
	}

	handleClientOperMessage(client, message) {
		client.setIsAuthenticated(false);

		var
			username = message.getUsername(),
			password = message.getPassword();

		if (!username || !password) {
			return this.sendNotEnoughParametersMessageToClient(client);
		}

		if (!this.hasAuthenticationCallback()) {
			return void this.sendPasswordMismatchMessageToClient(client);
		}

		var auth_callback = this.getAuthenticationCallback();

		var parameters = {
			username: username,
			password: password
		};

		function handler(error) {
			if (error) {
				return this.handleClientAuthenticationFailure(client, error);
			} else {
				return this.handleClientAuthenticationSuccess(client);
			}
		}

		auth_callback(parameters, handler.bind(this));
	}

	handleClientAuthenticationFailure(client, error) {
		switch (error.reply) {
			case Replies.ERR_NOOPERHOST:
				return this.sendHostnameMismatchMessageToClient(client);

			case Replies.ERR_PASSWDMISMATCH:
			default:
				return this.sendPasswordMismatchMessageToClient(client);
		}
	}

	handleClientAuthenticationSuccess(client) {
		this.sendOperatorReplyMessageToClient(client);
	}

	sendOperatorReplyMessageToClient(client) {
		var message = new YouAreOperatorMessage();

		client.sendMessage(message);
	}

	hasAuthenticationCallback() {
		return this.getAuthenticationCallback() !== null;
	}

	getAuthenticationCallback() {
		return this.authentication_callback;
	}

	setAuthenticationCallback(authentication_callback) {
		this.authentication_callback = authentication_callback;
		return this;
	}

}

extend(OperatorModule.prototype, {
	name:                    'Operators',
	type:                    ModuleTypes.OPERATORS,
	authentication_callback: null
});

module.exports = OperatorModule;
