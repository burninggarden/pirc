var
	extend = req('/utilities/extend');

var
	Service        = req('/lib/server/service'),
	Commands       = req('/constants/commands'),
	MessageBuilder = req('/lib/message-builder'),
	ServiceTypes   = req('/constants/service-types');

var
	AwayMessage          = req('/lib/server/messages/away'),
	WhoisUserMessage     = req('/lib/server/messages/whois-user'),
	WhoisServerMessage   = req('/lib/server/messages/whois-server'),
	WhoisHostMessage     = req('/lib/server/messages/whois-host'),
	WhoisIdleMessage     = req('/lib/server/messages/whois-idle'),
	WhoisModesMessage    = req('/lib/server/messages/whois-modes'),
	WhoisChannelsMessage = req('/lib/server/messages/whois-channels'),
	WhoisSecureMessage   = req('/lib/server/messages/whois-secure'),
	WhoisAccountMessage  = req('/lib/server/messages/whois-account'),
	EndOfWhoisMessage    = req('/lib/server/messages/end-of-whois');


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

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Commands.USER:
				return this.handleClientUserMessage(client, message);

			case Commands.WHOIS:
				return this.handleClientWhoisMessage(client, message);

			default:
				throw new Error(`Invalid command: ${command}`);
		}
	}

}

extend(UserService.prototype, {

	type: ServiceTypes.USER

});

module.exports = UserService;
