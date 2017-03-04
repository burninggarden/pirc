var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');


class ServerMyInfoMessage extends ServerMessage {

	setHostname(hostname) {
		this.getServerDetails().setHostname(hostname);
	}

	getHostname() {
		return this.getServerDetails().getHostname();
	}

	setVersion(version) {
		this.getServerDetails().setVersion(version);
	}

	getVersion() {
		return this.getServerDetails().getVersion();
	}

	setUserModes(user_modes) {
		this.getServerDetails().setUserModes(user_modes);
	}

	getUserModes() {
		return this.getServerDetails().getUserModes();
	}

	setChannelModes(channel_modes) {
		this.getServerDetails().setChannelModes(channel_modes);
	}

	getChannelModes() {
		return this.getServerDetails().getChannelModes();
	}

	applyParsedParams(middle_params) {
		this.addTargetFromString(middle_params[0]);

		var server_details = this.getServerDetails();

		server_details.setHostname(middle_params[1]);
		server_details.setVersion(middle_params[2]);
		server_details.setUserModesFromString(middle_params[3]);
		server_details.setChannelModesFromString(middle_params[4]);
	}

	serializeParams() {
		var
			targets            = this.serializeTargets(),
			server_details     = this.getServerDetails(),
			hostname           = server_details.getHostname(),
			version            = server_details.getVersion(),
			user_modes         = server_details.getUserModesAsString(),
			channel_modes      = server_details.getChannelModesAsString(),
			channel_user_modes = server_details.getChannelUserModesAsString();

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
