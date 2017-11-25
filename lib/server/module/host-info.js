
var
	extend = req('/lib/utility/extend');

var
	Enum_ModuleTypes = req('/lib/enum/module-types');

var
	Server_Module  = req('/lib/server/module'),
	MessageBuilder = req('/lib/message-builder');

var
	Message_Reply_Welcome       = req('/lib/message/reply/welcome'),
	Message_Reply_YourHost      = req('/lib/message/reply/your-host'),
	Message_Reply_MyInfo        = req('/lib/message/reply/my-info'),
	Message_Reply_Created       = req('/lib/message/reply/created'),
	Message_Reply_ISupport      = req('/lib/message/reply/i-support'),
	Message_Reply_LUserClient   = req('/lib/message/reply/l-user-client'),
	Message_Reply_LUserOp       = req('/lib/message/reply/l-user-op'),
	Message_Reply_LUserUnknown  = req('/lib/message/reply/l-user-unknown'),
	Message_Reply_LUserChannels = req('/lib/message/reply/l-user-channels'),
	Message_Reply_LUserMe       = req('/lib/message/reply/l-user-me'),
	Message_Reply_LocalUsers    = req('/lib/message/reply/local-users'),
	Message_Reply_GlobalUsers   = req('/lib/message/reply/global-users'),
	Message_Reply_StatsDLine    = req('/lib/message/reply/stats-dline'),
	Message_Reply_MotdStart     = req('/lib/message/reply/motd-start'),
	Message_Reply_Motd          = req('/lib/message/reply/motd'),
	Message_Reply_EndOfMotd     = req('/lib/message/reply/end-of-motd'),
	Message_Reply_NoMotd        = req('/lib/message/reply/no-motd');


class Server_Module_HostInfo extends Server_Module {

	hasMotd() {
		return this.getServerDetails().hasMotd();
	}

	getMotd() {
		return this.getServerDetails().getMotd();
	}

	setMotd(motd) {
		this.getServerDetails().setMotd(motd);
	}

	coupleToClient(client) {
		this.sendWelcomeMessageToClient(client);
		this.sendYourHostMessageToClient(client);
		this.sendCreatedMessageToClient(client);
		this.sendMyInfoMessageToClient(client);
		this.sendISupportMessagesToClient(client);
		this.sendLUserMessagesToClient(client);
		this.sendLocalUsersMessageToClient(client);
		this.sendGlobalUsersMessageToClient(client);
		this.sendStatsDLineMessageToClient(client);

		if (!this.hasMotd()) {
			this.sendMotdMissingErrorToClient(client);
		} else {
			this.sendMotdStartToClient(client);
			this.sendMotdToClient(client);
			this.sendEndOfMotdMessageToClient(client);
		}
	}

	decoupleFromClient() {
		// Deliberately a noop.
	}

	getChannelCount() {
		return this.getServerDetails().getChannelCount();
	}

	hasChannels() {
		return this.getServerDetails().hasChannels();
	}

	getGlobalUserCount() {
		return this.getServerDetails().getGlobalUserCount();
	}

	getMaxGlobalUserCount() {
		return this.getServerDetails().getMaxGlobalUserCount();
	}

	getClientCount() {
		return this.getServerDetails().getClientCount();
	}

	getUserCount() {
		return this.getServerDetails().getUserCount();
	}

	getMaxUserCount() {
		return this.getServerDetails().getMaxUserCount();
	}

	getGlobalServiceCount() {
		return this.getServerDetails().getGlobalServiceCount();
	}

	getServerCount() {
		return this.getServerDetails().getServerCount();
	}

	hasOperators() {
		return this.getServerDetails().hasOperators();
	}

	getOperatorCount() {
		return this.getServerDetails().getOperatorCount();
	}

	hasUnknownConnections() {
		return this.getServerDetails().hasUnknownConnections();
	}

	getUnknownConnectionCount() {
		return this.getServerDetails().getUnknownConnectionCount();
	}

	getMaxConnectionCount() {
		return this.getServerDetails().getMaxConnectionCount();
	}

	getTotalConnectionCount() {
		return this.getServerDetails().getTotalConnectionCount();
	}

	getMaxClientCount() {
		return this.getServerDetails().getMaxClientCount();
	}

	sendWelcomeMessageToClient(client) {
		var message = (new Message_Reply_Welcome())
			.setUserId(client.getUserId());

		this.sendMessageToClient(message, client);
	}

	sendYourHostMessageToClient(client) {
		var
			message        = new Message_Reply_YourHost(),
			server_details = this.getServerDetails();

		message.setHostname(server_details.getHostname());
		message.setServerVersion(server_details.getVersion());

		this.sendMessageToClient(message, client);
	}

	sendCreatedMessageToClient(client) {
		var message = new Message_Reply_Created();

		message.setTimestamp(this.getServerDetails().getCreatedTimestamp());

		this.sendMessageToClient(message, client);
	}

	sendMyInfoMessageToClient(client) {
		var
			message        = new Message_Reply_MyInfo(),
			server_details = this.getServerDetails();

		message.setHostname(server_details.getHostname());
		message.setServerVersion(server_details.getVersion());
		message.setUserModes(server_details.getUserModes());
		message.setChannelModes(server_details.getChannelModes());

		this.sendMessageToClient(message, client);
	}

	sendLUserMessagesToClient(client) {
		this.sendLUserClientMessageToClient(client);

		// The following LUSERS reply messages are only sent if non-zero
		// values are found for the counts that they embody:
		if (this.hasOperators()) {
			this.sendLUserOpMessageToClient(client);
		}

		if (this.hasUnknownConnections()) {
			this.sendLUserUnknownMessageToClient(client);
		}

		if (this.hasChannels()) {
			this.sendLUserChannelsMessageToClient(client);
		}

		this.sendLUserMeMessageToClient(client);
	}

	createISupportMessageForClient(client) {
		var message = new Message_Reply_ISupport();

		message.setOriginHostname(this.getHostname());
		message.setTarget(client.getNickname());

		return message;
	}

	sendISupportMessagesToClient(client) {
		var messages = MessageBuilder.buildMessagesFromWords(
			this.getServerDetails().serializeSettings(),
			this.createISupportMessageForClient.bind(this, client)
		);

		messages.forEach(client.sendMessage, client);
	}

	sendLUserClientMessageToClient(client) {
		var message = (new Message_Reply_LUserClient())
			.setUserCount(this.getGlobalUserCount())
			.setServiceCount(this.getGlobalServiceCount())
			.setServerCount(this.getServerCount());

		this.sendMessageToClient(message, client);
	}

	sendLUserOpMessageToClient(client) {
		var message = (new Message_Reply_LUserOp())
			.setOperatorCount(this.getOperatorCount());

		this.sendMessageToClient(message, client);
	}

	sendLUserUnknownMessageToClient(client) {
		var message = (new Message_Reply_LUserUnknown())
			.setUnknownUserCount(this.getUnknownUserCount());

		this.sendMessageToClient(message, client);
	}

	sendLUserChannelsMessageToClient(client) {
		var message = (new Message_Reply_LUserChannels())
			.setChannelCount(this.getChannelCount());

		this.sendMessageToClient(message, client);
	}

	sendLUserMeMessageToClient(client) {
		var message = (new Message_Reply_LUserMe())
			.setClientCount(this.getClientCount())
			.setServerCount(this.getServerCount());

		this.sendMessageToClient(message, client);
	}

	sendLocalUsersMessageToClient(client) {
		var message = (new Message_Reply_LocalUsers())
			.setUserCount(this.getUserCount())
			.setMaxUserCount(this.getMaxUserCount());

		this.sendMessageToClient(message, client);
	}

	sendGlobalUsersMessageToClient(client) {
		var message = (new Message_Reply_GlobalUsers())
			.setUserCount(this.getGlobalUserCount())
			.setMaxUserCount(this.getMaxGlobalUserCount());

		this.sendMessageToClient(message, client);
	}

	sendStatsDLineMessageToClient(client) {
		var message = (new Message_Reply_StatsDLine())
			.setMaxConnectionCount(this.getMaxConnectionCount())
			.setTotalConnectionCount(this.getTotalConnectionCount())
			.setMaxClientCount(this.getMaxClientCount());

		this.sendMessageToClient(message, client);
	}

	sendMessageToClient(message, client) {
		client.sendMessage(message);
	}

	sendMotdStartToClient(client) {
		var
			message        = new Message_Reply_MotdStart(),
			server_details = this.getServerDetails();

		message.setHostname(server_details.getHostname());

		this.sendMessageToClient(message, client);
	}

	sendMotdToClient(client) {
		var lines = this.getMotd().split('\n');

		lines.forEach(function each(line) {
			this.sendMotdLineToClient(line, client);
		}, this);
	}

	sendMotdLineToClient(line, client) {
		// Per the RFC, each line should be less than or equal to 80 characters
		// in length. If we receive one that's longer, split it into two
		// separate lines, instead.
		//
		// TODO: Split intelligently on nearest space, if one exists.
		if (line.length > 80) {
			this.sendMotdLineToClient(line.slice(0, 80), client);
			this.sendMotdLineToClient(line.slice(80),    client);
			return;
		}

		var message = new Message_Reply_Motd();

		message.setText(line);
		message.setTarget(client.getNickname());

		client.sendMessage(message);
	}

	sendEndOfMotdMessageToClient(client) {
		this.sendMessageToClient(new Message_Reply_EndOfMotd(), client);
	}

	sendMotdMissingErrorToClient(client) {
		this.sendMessageToClient(new Message_Reply_NoMotd(), client);
	}

}

extend(Server_Module_HostInfo.prototype, {

	type: Enum_ModuleTypes.HOST_INFO

});

module.exports = Server_Module_HostInfo;
