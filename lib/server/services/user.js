var
	extend = req('/utilities/extend');

var
	Service        = req('/lib/server/service'),
	Commands       = req('/constants/commands'),
	MessageBuilder = req('/lib/message-builder'),
	ServiceTypes   = req('/constants/service-types'),
	ModeActions    = req('/constants/mode-actions'),
	ErrorReasons   = req('/constants/error-reasons'),
	UserDetails    = req('/lib/user-details'),
	UserModes      = req('/constants/user-modes'),
	ErrorCodes     = req('/constants/error-codes');

var
	InvalidModeActionError = req('/lib/errors/invalid-mode-action');

var
	AwayMessage             = req('/lib/server/messages/away'),
	WhoisUserMessage        = req('/lib/server/messages/whois-user'),
	WhoisServerMessage      = req('/lib/server/messages/whois-server'),
	WhoisHostMessage        = req('/lib/server/messages/whois-host'),
	WhoisIdleMessage        = req('/lib/server/messages/whois-idle'),
	WhoisModesMessage       = req('/lib/server/messages/whois-modes'),
	WhoisChannelsMessage    = req('/lib/server/messages/whois-channels'),
	WhoisSecureMessage      = req('/lib/server/messages/whois-secure'),
	WhoisAccountMessage     = req('/lib/server/messages/whois-account'),
	EndOfWhoisMessage       = req('/lib/server/messages/end-of-whois'),
	UModeUnknownFlagMessage = req('/lib/server/messages/umode-unknown-flag'),
	NoPrivilegesMessage     = req('/lib/server/messages/no-privileges'),
	ModeMessage             = req('/lib/server/messages/mode'),
	NeedMoreParamsMessage   = req('/lib/server/messages/need-more-params');


class UserService extends Service {

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

		// Read: If the client is requesting info about herself, we can
		// return some additional information in the form of RPL_WHOISHOST:
		if (user_details.matches(client.getUserDetails())) {
			messages.push(this.getWhoisHostMessageForUserDetails(user_details));
		}

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

		messages.push(this.getWhoisModesMessageForUserDetails(user_details));

		if (user_details.isAway()) {
			messages.push(this.getAwayMessageForUserDetails(user_details));
		}

		if (user_details.hasSecureConnection()) {
			messages.push(this.getWhoisSecureMessageForUserDetails(user_details));
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

	getWhoisHostMessageForUserDetails(user_details) {
		var message = new WhoisHostMessage();

		message.setTargetUserDetails(user_details);

		return message;
	}

	getWhoisModesMessageForUserDetails(user_details) {
		var message = new WhoisModesMessage();

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
		var message = new WhoisChannelsMessage();

		message.setTargetUserDetails(user_details);
		message.addTarget(client.getUserDetails());
		message.setServerDetails(client.getServerDetails());

		return message;
	}

	getWhoisSecureMessageForUserDetails(user_details) {
		var message = new WhoisSecureMessage();

		message.setTargetUserDetails(user_details);

		return message;
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
		var first_target = message.getFirstTarget();

		if (!(first_target instanceof UserDetails)) {
			console.log(first_target);
			throw new Error('wtf');
		}

		if (!first_target.matches(client.getUserDetails())) {
			let existing_client = this.getClientForUserDetails(first_target);

			// NOTICE:
			// According to the spec, we should technically be returning
			// ERR_USERSDONTMATCH for both of these cases. But I'll take my
			// cue from InspIRCd, which returns a ERR_NOSUCHNICK in the case
			// of an unrecognized user target, and only returns
			// ERR_USERSDONTMATCH if the specified client exists but is
			// different from the sender.
			if (existing_client) {
				this.sendUsersDontMatchMessageToClientForUserDetails(
					client,
					first_target
				);
			} else {
				this.sendNoSuchNickMessageToClientForUserDetails(
					client,
					first_target
				);
			}

			return;
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
				throw new InvalidModeActionError(mode, ErrorReasons.WRONG_TYPE);
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
		var
			message = new NoPrivilegesMessage(),
			mode    = mode_change.getMode();

		message.setBody('Permission Denied - Only operators may set user mode ' + mode);

		client.sendMessage(message);
	}

	sendModeMessageToClientForModeChanges(client, mode_changes) {
		var message = new ModeMessage();

		mode_changes.forEach(function each(mode_change) {
			message.addModeChange(mode_change);
		});

		// These two lines are necessary in order to enable the message
		// to be treated as originating from the client during serialization,
		// instead of from the server.
		message.setIsFromServer(false);
		message.setUserDetails(client.getUserDetails());

		client.sendMessage(message);
	}

	handleClientModeChangeError(client, error) {
		var code = error.getCode();

		switch (code) {
			case ErrorCodes.INVALID_MODE_PARAMETERS:
				return this.handleClientModeChangeInvalidParametersError(
					client,
					error
				);

			default:
				throw error;
		}
	}

	handleClientModeChangeInvalidParametersError(client, error) {
		var reason = error.getReason();

		if (reason === ErrorReasons.NOT_ENOUGH_PARAMETERS) {
			let message = new NeedMoreParamsMessage();

			message.setAttemptedCommand(Commands.MODE);

			client.sendMessage(message);
			return;
		}

		throw error;
	}

	sendUModeUnknownFlagMessageToClient(mode, client) {
		var message = new UModeUnknownFlagMessage();

		message.setMode(mode);

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

extend(UserService.prototype, {

	type: ServiceTypes.USER

});

module.exports = UserService;
