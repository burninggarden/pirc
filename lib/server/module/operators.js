
var
	extend        = require('../../utility/extend'),
	has           = require('../../utility/has'),
	Server_Module = require('../../server/module');

var
	Enum_Commands    = require('../../enum/commands'),
	Enum_Replies     = require('../../enum/replies'),
	Enum_ModuleTypes = require('../../enum/module-types'),
	Enum_UserModes   = require('../../enum/user-modes');

var
	Message_Reply_YouAreOperator   = require('../../message/reply/you-are-operator'),
	Message_Command_Mode           = require('../../message/command/mode'),
	Message_Reply_PasswordMismatch = require('../../message/reply/password-mismatch'),
	Message_Reply_NoPrivileges     = require('../../message/reply/no-privileges'),
	Message_Reply_NoSuchServer     = require('../../message/reply/no-such-server');


class Server_Module_Operators extends Server_Module {

	coupleToClient() {
		// Noop by default.
	}

	decoupleFromClient() {
		// Noop for now.
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Enum_Commands.CONNECT:
				return this.handleClientConnectMessage(client, message);

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
		this.sendYouAreOperatorMessageToClient(client);
		this.addOperatorUserModesForClient(user_modes, client);
	}

	sendPasswordMismatchMessageToClient(client) {
		var message = new Message_Reply_PasswordMismatch();

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

		var message = new Message_Command_Mode();

		message.setOriginUserId(client.getUserId());
		message.setNickname(client.getNickname());
		message.addUserModes(user_modes);

		return void client.sendMessage(message);
	}

	sendYouAreOperatorMessageToClient(client) {
		var message = new Message_Reply_YouAreOperator();

		return void client.sendMessage(message);
	}

	/**
	 * @param   {Server_Connection_Client} client
	 * @param   {Message_Command_Restart} message
	 * @returns {void}
	 */
	handleClientRestartMessage(client, message) {
		if (!client.isOperator()) {
			var message = new Message_Reply_NoPrivileges();

			return void client.sendMessage(message);
		}

		this.sendNoticeToAllClients('Server restarting.');
		this.getServerDetails().setShouldRestart();
	}

	/**
	 * @param   {Server_Connection_Client} client
	 * @param   {Message_Command_Connect} message
	 * @returns {void}
	 */
	handleClientConnectMessage(client, message) {
		if (!client.isOperator()) {
			var message = new Message_Reply_NoPrivileges();

			return void client.sendMessage(message);
		}

		if (message.hasRemoteServer()) {
			// TODO: this
			throw new Error('Implement forwarding to remote server');
		}

		var
			hostname   = message.getTargetServer(),
			port       = message.getPort(),
			parameters = { hostname, port };

		function handler(error) {
			// TODO: Ensure that the error indicates the server was not found
			if (error) {
				console.log(error);
				var message = new Message_Reply_NoSuchServer();

				message.setHostname(hostname);

				return void client.sendMessage(message);
			}

			// Nothing to do in the case of a successful connection.
		}

		this.getServer().connectToServer(parameters, handler.bind(this));
	}

}

extend(Server_Module_Operators.prototype, {
	name: 'Operators',
	type: Enum_ModuleTypes.OPERATORS
});

module.exports = Server_Module_Operators;
