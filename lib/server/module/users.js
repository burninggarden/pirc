var
	extend = req('/lib/utility/extend');

var
	Enum_Commands    = req('/lib/enum/commands'),
	Enum_ModuleTypes = req('/lib/enum/module-types'),
	Enum_ModeActions = req('/lib/enum/mode-actions'),
	Enum_UserModes   = req('/lib/enum/user-modes'),
	Enum_TargetTypes = req('/lib/enum/target-types');


var
	Server_Module  = req('/lib/server/module'),
	MessageBuilder = req('/lib/message-builder'),
	UserDetails    = req('/lib/user-details');


var
	Message_Reply_Away                = req('/lib/message/reply/away'),
	Message_Reply_NowAway             = req('/lib/message/reply/now-away'),
	Message_Reply_Unaway              = req('/lib/message/reply/unaway'),
	Message_Reply_WhoisUser           = req('/lib/message/reply/whois-user'),
	Message_Reply_WhoisServer         = req('/lib/message/reply/whois-server'),
	Message_Reply_WhoisIdle           = req('/lib/message/reply/whois-idle'),
	Message_Reply_WhoisAccount        = req('/lib/message/reply/whois-account'),
	Message_Reply_EndOfWhois          = req('/lib/message/reply/end-of-whois'),
	Message_Reply_UserModeUnknownFlag = req('/lib/message/reply/user-mode-unknown-flag'),
	Message_Reply_UserModeIs          = req('/lib/message/reply/user-mode-is');


var
	Message_Command_Mode  = req('/lib/message/command/mode'),
	Message_Command_Error = req('/lib/message/command/error');


class Server_Module_Users extends Server_Module {

	coupleToClient() {
		// Deliberately a noop
	}

	decoupleFromClient() {
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

		modes.forEach(user_details.addMode, user_details);
	}

	handleClientWhoisMessage(client, message) {
		var user_targets = message.getUserTargets();

		user_targets.forEach(function each(user_target) {
			this.handleClientWhoisMessageForUserTarget(client, user_target);
		}, this);
	}

	handleClientWhoisMessageForUserTarget(client, user_target) {
		var client_targets = this.getClientsForUserDetails(user_target);

		if (client_targets.length === 0) {
			if (!user_target.hasMask()) {
				this.sendNoSuchNickMessageToClientForUserDetails(
					client,
					user_target
				);

				var end_message = this.getEndOfWhoisMessageForUserDetails(
					user_target
				);

				client.sendMessage(end_message);
			} else {
				throw new Error('implement');
			}

			return;
		}

		client_targets.forEach(function each(client_target) {
			this.handleClientWhoisMessageForClientTarget(
				client,
				client_target
			);
		}, this);
	}

	handleClientWhoisMessageForClientTarget(client, client_target) {
		var messages = this.getWhoisMessagesForClientAndClientTarget(
			client,
			client_target
		);

		messages.forEach(client.sendMessage, client);
	}

	getWhoisMessagesForClientAndClientTarget(client, client_target) {
		var user_details = client_target.getUserDetails();

		return this.getWhoisMessagesForClientAndUserDetails(
			client,
			user_details
		);
	}

	getWhoisMessagesForClientAndUserDetails(client, user_details) {
		var messages = [ ];

		messages.push(this.getWhoisUserMessageForUserDetails(user_details));

		messages = messages.concat(
			this.getWhoisChannelsMessagesForClientAndUserDetails(
				client,
				user_details
			)
		);

		messages.push(this.getWhoisServerMessageForUserDetails(user_details));

		if (user_details.isOperator()) {
			let message = this.getWhoisOperatorMessageForUserDetails(
				user_details
			);

			messages.push(message);
		}

		if (user_details.isLocatedOnServer(this.getServerDetails())) {
			let message = this.getWhoisIdleMessageForUserDetails(user_details);

			messages.push(message);
		}

		if (user_details.isAway()) {
			messages.push(this.getAwayMessageForUserDetails(user_details));
		}

		if (user_details.isAuthenticated()) {
			messages.push(this.getWhoisAccountMessageForUserDetails(user_details));
		}

		messages.push(this.getEndOfWhoisMessageForUserDetails(user_details));

		return messages;
	}

	getWhoisUserMessageForUserDetails(user_details) {
		var message = new Message_Reply_WhoisUser();

		message.setTargetUserDetails(user_details);

		return message;
	}

	getWhoisServerMessageForUserDetails(user_details) {
		var message = new Message_Reply_WhoisServer();

		message.setTargetUserDetails(user_details);

		return message;
	}

	getWhoisIdleMessageForUserDetails(user_details) {
		var message = new Message_Reply_WhoisIdle();

		message.setTargetUserDetails(user_details);

		return message;
	}

	getAwayMessageForUserDetails(user_details) {
		var message = new Message_Reply_Away();

		message.setTargetUserDetails(user_details);

		return message;
	}

	getWhoisChannelsMessagesForClientAndUserDetails(client, user_details) {
		if (!user_details.hasChannelNames()) {
			return [ ];
		}

		var
			channel_names = user_details.getChannelNamesWithPrefixes(),
			body          = channel_names.join(' ');

		var fn = this.createWhoisChannelsMessageForClientAndUserDetails.bind(
			this,
			client,
			user_details
		);

		return MessageBuilder.buildMultipleMessages(body, fn);
	}

	createWhoisChannelsMessageForClientAndUserDetails(client, user_details) {
		throw new Error('die');
	}

	getWhoisAccountMessageForUserDetails(user_details) {
		var message = new Message_Reply_WhoisAccount();

		message.setTargetUserDetails(user_details);

		return message;
	}

	getEndOfWhoisMessageForUserDetails(user_details) {
		var message = new Message_Reply_EndOfWhois();

		message.setUserDetails(user_details);

		return message;
	}

	handleClientModeMessage(client, message) {
		if (!message.hasModeChanges()) {
			return this.handleClientModeQueryMessage(client, message);
		}

		var
			nickname    = message.getNickname(),
			user_target = UserDetails.fromNickname(nickname);

		if (!user_target.matches(client.getUserDetails())) {
			return this.sendUsersDontMatchMessageToClientForUserDetails(
				client,
				user_target
			);
		}

		var
			mode_changes       = message.getModeChanges(),
			successful_changes = [ ];

		mode_changes.forEach(function each(mode_change) {
			var was_successful = this.handleClientModeChange(
				client,
				mode_change
			);

			// The "handleClientModeChange()" method returns a boolean value
			// indicating whether the mode change was applied successfully.
			if (was_successful) {
				successful_changes.push(mode_change);
			}
		}, this);

		if (successful_changes.length > 0) {
			// Finally, we should send a MODE response message to the client
			// indicating those mode changes that were successfully applied:
			this.sendModeMessageToClientForModeChanges(client, successful_changes);
		}
	}

	handleClientModeQueryMessage(client, message) {
		var
			nickname            = message.getNickname(),
			user_target         = UserDetails.fromNickname(nickname),
			client_user_details = client.getUserDetails();

		if (!user_target.matches(client_user_details)) {
			return this.sendUsersDontMatchMessageToClientForUserDetails(
				client,
				user_target
			);
		}

		var message = new Message_Reply_UserModeIs();

		message.setUserModes(client_user_details.getModes());

		return void client.sendMessage(message);
	}

	/**
	 * @param   {object} client
	 * @param   {object} mode_change
	 * @returns {boolean} Whether or not the change was successful
	 */
	handleClientModeChange(client, mode_change) {
		var
			server_details = this.getServerDetails(),
			mode           = mode_change.getMode();

		if (!server_details.hasUserMode(mode)) {
			this.sendUserModeUnknownFlagMessageToClient(mode, client);
			return false;
		}

		try {
			mode_change.validate();
		} catch (error) {
			console.log(error);
			this.handleClientModeChangeError(client, error);
			return false;
		}

		if (!this.clientHasPermissionToSetMode(client, mode)) {
			// Per the RFC, we just silently drop these attempted changes,
			// rather than trying to generate a reply to them.
			return false;
		}

		var
			user_details = client.getUserDetails(),
			action       = mode_change.getAction();

		switch (action) {
			case Enum_ModeActions.ADD:
				return user_details.applyAdditionModeChange(mode_change);

			case Enum_ModeActions.REMOVE:
				return user_details.applyRemovalModeChange(mode_change);

			default:
				throw new Error('Invalid mode action: ' + mode);
		}
	}

	clientHasPermissionToSetMode(client, mode) {
		if (mode === Enum_UserModes.OPERATOR) {
			return client.getUserDetails().isOperator();
		}

		if (mode === Enum_UserModes.RESTRICTED) {
			return !client.getUserDetails().isRestricted();
		}

		return true;
	}

	sendModeMessageToClientForModeChanges(client, mode_changes) {
		var message = new Message_Command_Mode();

		message.setTargetType(Enum_TargetTypes.USER);
		message.setOriginUserId(client.getUserId());

		mode_changes.forEach(function each(mode_change) {
			message.addModeChange(mode_change);
		});

		client.sendMessage(message);
	}

	sendUserModeUnknownFlagMessageToClient(mode, client) {
		var message = new Message_Reply_UserModeUnknownFlag();

		client.sendMessage(message);
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Enum_Commands.AWAY:
				return this.handleClientAwayMessage(client, message);

			case Enum_Commands.USER:
				return this.handleClientUserMessage(client, message);

			case Enum_Commands.WHOIS:
				return this.handleClientWhoisMessage(client, message);

			case Enum_Commands.MODE:
				return this.handleClientModeMessage(client, message);

			case Enum_Commands.QUIT:
				return this.handleClientQuitMessage(client, message);

			default:
				throw new Error(`Invalid command: ${command}`);
		}
	}

	/**
	 * @param   {lib/server/connections/client} client
	 * @param   {lib/message} message
	 * @returns {void}
	 */
	handleClientAwayMessage(client, message) {
		var text = message.getText();

		if (text) {
			client.setAwayMessage(text);
			this.sendNowAwayMessageToClient(client);
		} else {
			client.setAwayMessage(null);
			this.sendUnawayMessageToClient(client);
		}
	}

	sendNowAwayMessageToClient(client) {
		var message = new Message_Reply_NowAway();

		client.sendMessage(message);
	}

	sendUnawayMessageToClient(client) {
		var message = new Message_Reply_Unaway();

		client.sendMessage(message);
	}

	handleClientQuitMessage(client, message) {
		var observers = this.getObserversForClient(client);

		observers.forEach(function each(observer) {
			observer.sendMessage(message);
		});

		var error_message = new Message_Command_Error();

		error_message.setText('Closing link');

		client.sendMessage(error_message);
		client.disconnect();
	}

}

extend(Server_Module_Users.prototype, {

	type: Enum_ModuleTypes.USERS

});

module.exports = Server_Module_Users;
