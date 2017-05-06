
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerMyInfoMessage extends ServerMessage {

	setHostname(hostname) {
		this.getRemoteServerDetails().setHostname(hostname);
	}

	getHostname() {
		return this.getLocalServerDetails().getHostname();
	}

	setVersion(version) {
		this.getRemoteServerDetails().setVersion(version);
	}

	getVersion() {
		return this.getLocalServerDetails().getVersion();
	}

	setUserModesFromString(user_modes_string) {
		this.getRemoteServerDetails().setUserModesFromString(user_modes_string);
	}

	getUserModesAsString() {
		return this.getLocalServerDetails().getUserModesAsString();
	}

	setChannelModesFromString(channel_modes_string) {
		this.getRemoteServerDetails().setChannelModesFromString(
			channel_modes_string
		);
	}

	getChannelModesAsString() {
		return this.getLocalServerDetails().getChannelModesAsString();
	}

	setChannelUserModesFromString(channel_user_modes_string) {
		this.getRemoteServerDetails().setChannelUserModesFromString(
			channel_user_modes_string
		);
	}

	getChannelUserModesAsString() {
		return this.getLocalServerDetails().getChannelUserModesAsString();
	}

	applyParsedParams(middle_params) {
		this.addTargetFromString(middle_params[0]);

		this.setHostname(middle_params[1]);
		this.setVersion(middle_params[2]);
		this.setUserModesFromString(middle_params[3]);
		this.setChannelModesFromString(middle_params[4]);
	}

	serializeParams() {
		var
			targets            = this.serializeTargets(),
			hostname           = this.getHostname(),
			version            = this.getVersion(),
			user_modes         = this.getUserModesAsString(),
			channel_modes      = this.getChannelModesAsString(),
			channel_user_modes = this.getChannelUserModesAsString();

		// TODO:
		// InspIRCd returns an additional mode list parameter here,
		// denoting those channel modes that require parameters.
		// Should we mimic that functionality? Do other IRCDs do the same?

		return `${targets} ${hostname} ${version} ${user_modes} ${channel_modes}${channel_user_modes}`;
	}

}

extend(ServerMyInfoMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_MYINFO

});

module.exports = ServerMyInfoMessage;
