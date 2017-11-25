
var
	extend = req('/lib/utility/extend'),
	has    = req('/lib/utility/has'),
	Module = req('/lib/server/module');

var
	Enum_Commands    = req('/lib/enum/commands'),
	Enum_Replies     = req('/lib/enum/replies'),
	Enum_ModuleTypes = req('/lib/enum/module-types'),
	Enum_UserModes   = req('/lib/enum/user-modes');

var
	YouAreOperatorMessage   = req('/lib/message/reply/you-are-operator'),
	ModeMessage             = req('/lib/message/command/mode'),
	PasswordMismatchMessage = req('/lib/message/reply/password-mismatch'),
	NoPrivilegesMessage     = req('/lib/message/reply/no-privileges');


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
			case Enum_Commands.OPER:
				return this.handleClientOperMessage(client, message);

			case Enum_Commands.RESTART:
				return this.handleClientRestartMessage(client, message);

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
			case Enum_Replies.ERR_NOOPERHOST:
				return this.sendHostnameMismatchMessageToClient(client);

			case Enum_Replies.ERR_PASSWDMISMATCH:
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
				case Enum_UserModes.LOCAL_OPERATOR:
					has_local_op = true;
					return;

				case Enum_UserModes.OPERATOR:
					has_global_op = true;
					return;

				default:
					throw new Error(
						`Invalid user mode returned from OPER auth: ${user_mode}`
					);
			}
		});

		var
			has_local_op  = has(user_modes, Enum_UserModes.LOCAL_OPERATOR),
			has_global_op = has(user_modes, Enum_UserModes.OPERATOR);

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

	/**
	 * @param   {Server_Connection_Client} client
	 * @param   {Message_Command_Restart} message
	 * @returns {void}
	 */
	handleClientRestartMessage(client, message) {
		if (!client.isOperator()) {
			var message = new NoPrivilegesMessage();

			return void client.sendMessage(message);
		}

		this.sendNoticeToAllClients('Server restarting.');
		this.getServerDetails().setShouldRestart();
	}

}

extend(OperatorModule.prototype, {
	name:                    'Operators',
	type:                    Enum_ModuleTypes.OPERATORS,
	authentication_callback: null
});

module.exports = OperatorModule;
