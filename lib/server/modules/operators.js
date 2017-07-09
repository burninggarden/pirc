
var
	extend      = req('/lib/utilities/extend'),
	has         = req('/lib/utilities/has'),
	Module      = req('/lib/server/module'),
	Commands    = req('/lib/constants/commands'),
	Replies     = req('/lib/constants/replies'),
	ModuleTypes = req('/lib/constants/module-types'),
	UserModes   = req('/lib/constants/user-modes');

var
	YouAreOperatorMessage   = req('/lib/messages/replies/you-are-operator'),
	ModeMessage             = req('/lib/messages/commands/mode'),
	PasswordMismatchMessage = req('/lib/messages/replies/password-mismatch');


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

		function handler(error, user_modes) {
			if (error) {
				this.handleClientAuthenticationFailure(client, error);
			} else {
				this.handleClientAuthenticationSuccess(client, user_modes);
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

	handleClientAuthenticationSuccess(client, user_modes) {
		this.sendOperatorReplyMessageToClient(client);
		this.addOperatorUserModesForClient(user_modes, client);
	}

	sendPasswordMismatchMessageToClient(client) {
		var message = new PasswordMismatchMessage();

		client.sendMessage(message);
	}

	addOperatorUserModesForClient(user_modes, client) {
		if (!user_modes) {
			throw new Error('Invalid user modes returned from OPER auth');
		}

		user_modes.forEach(function each(user_mode) {
			switch (user_mode) {
				case UserModes.LOCAL_OPERATOR:
					has_local_op = true;
					return;

				case UserModes.OPERATOR:
					has_global_op = true;
					return;

				case UserModes.WALLOPS:
					return;

				default:
					throw new Error(
						`Invalid user mode returned from OPER auth: ${user_mode}`
					);
			}
		});

		var
			has_local_op  = has(user_modes, UserModes.LOCAL_OPERATOR),
			has_global_op = has(user_modes, UserModes.OPERATOR);

		if (!has_local_op && !has_global_op) {
			throw new Error('Must return an operator user mode from OPER auth');
		}

		client.getUserDetails().addModes(user_modes);

		var message = new ModeMessage();

		message.setOriginUserId(client.getUserId());
		message.setNickname(client.getNickname());
		message.addUserModes(user_modes);

		return void client.sendMessage(message);
	}

	sendOperatorReplyMessageToClient(client) {
		var message = new YouAreOperatorMessage();

		return void client.sendMessage(message);
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
