var
	extend = req('/lib/utilities/extend');

var
	Module         = req('/lib/server/module'),
	Commands       = req('/lib/constants/commands'),
	MessageBuilder = req('/lib/message-builder'),
	ModuleTypes    = req('/lib/constants/module-types'),
	ModeActions    = req('/lib/constants/mode-actions'),
	UserDetails    = req('/lib/user-details'),
	UserModes      = req('/lib/constants/user-modes'),
	TargetTypes    = req('/lib/constants/target-types');

var
	AwayMessage             = req('/lib/messages/replies/away'),
	WhoisUserMessage        = req('/lib/messages/replies/whois-user'),
	WhoisServerMessage      = req('/lib/messages/replies/whois-server'),
	WhoisIdleMessage        = req('/lib/messages/replies/whois-idle'),
	WhoisAccountMessage     = req('/lib/messages/replies/whois-account'),
	EndOfWhoisMessage       = req('/lib/messages/replies/end-of-whois'),
	UModeUnknownFlagMessage = req('/lib/messages/replies/umode-unknown-flag'),
	NoPrivilegesMessage     = req('/lib/messages/replies/no-privileges');


var
	ModeMessage = req('/lib/messages/commands/mode');


class UserModule extends Module {

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
		var message = new WhoisUserMessage();

		message.setTargetUserDetails(user_details);

		return message;
	}

	getWhoisServerMessageForUserDetails(user_details) {
		var message = new WhoisServerMessage();

		message.setTargetUserDetails(user_details);

		return message;
	}

	getWhoisIdleMessageForUserDetails(user_details) {
		var message = new WhoisIdleMessage();

		message.setTargetUserDetails(user_details);

		return message;
	}

	getAwayMessageForUserDetails(user_details) {
		var message = new AwayMessage();

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
		var message = new WhoisAccountMessage();

		message.setTargetUserDetails(user_details);

		return message;
	}

	getEndOfWhoisMessageForUserDetails(user_details) {
		var message = new EndOfWhoisMessage();

		message.setUserDetails(user_details);

		return message;
	}

	handleClientModeMessage(client, message) {
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
			this.sendUModeUnknownFlagMessageToClient(mode, client);
			return false;
		}

		try {
			mode_change.validate();
		} catch (error) {
			this.handleClientModeChangeError(client, error);
			return false;
		}

		if (!this.clientHasPermissionToSetMode(client, mode)) {
			this.sendNoPrivilegesMessageToClientForModeChange(
				client,
				mode_change
			);
			return false;
		}

		var
			user_details = client.getUserDetails(),
			action       = mode_change.getAction();

		switch (action) {
			case ModeActions.ADD:
				return user_details.applyAdditionModeChange(mode_change);

			case ModeActions.REMOVE:
				return user_details.applyRemovalModeChange(mode_change);

			default:
				throw new Error('Invalid mode action: ' + mode);
		}
	}

	clientHasPermissionToSetMode(client, mode) {
		if (mode !== UserModes.OPERATOR) {
			return true;
		}

		if (client.getUserDetails().isOperator()) {
			return true;
		}

		return false;
	}

	sendNoPrivilegesMessageToClientForModeChange(client, mode_change) {
		// TODO: Figure out if there's a way to reference mode change
		var message = new NoPrivilegesMessage();

		client.sendMessage(message);
	}

	sendModeMessageToClientForModeChanges(client, mode_changes) {
		var message = new ModeMessage();

		message.setTargetType(TargetTypes.USER);
		message.setOriginUserId(client.getUserId());

		mode_changes.forEach(function each(mode_change) {
			message.addModeChange(mode_change);
		});

		client.sendMessage(message);
	}

	sendUModeUnknownFlagMessageToClient(mode, client) {
		var message = new UModeUnknownFlagMessage();

		client.sendMessage(message);
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.USER:
				return this.handleClientUserMessage(client, message);

			case Commands.WHOIS:
				return this.handleClientWhoisMessage(client, message);

			case Commands.MODE:
				return this.handleClientModeMessage(client, message);

			default:
				throw new Error(`Invalid command: ${command}`);
		}
	}

}

extend(UserModule.prototype, {

	type: ModuleTypes.USER

});

module.exports = UserModule;
