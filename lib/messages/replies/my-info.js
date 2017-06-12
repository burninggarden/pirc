
var
	extend        = req('/lib/utilities/extend'),
	ReplyMessage  = req('/lib/messages/reply'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class MyInfoMessage extends ReplyMessage {

	setRemoteHostname(hostname) {
		this.getRemoteServerDetails().setHostname(hostname);
	}

	getLocalHostname() {
		return this.getLocalServerDetails().getHostname();
	}

	getRemoteHostname() {
		return this.getRemoteServerDetails().getHostname();
	}

	setRemoteVersion(version) {
		this.getRemoteServerDetails().setVersion(version);
	}

	getRemoteVersion() {
		return this.getRemoteServerDetails().getVersion();
	}

	getLocalVersion() {
		return this.getLocalServerDetails().getVersion();
	}

	setRemoteUserModesFromString(user_modes_string) {
		this.getRemoteServerDetails().setUserModesFromString(
			user_modes_string
		);
	}

	getLocalUserModesAsString() {
		return this.getLocalServerDetails().getUserModesAsString();
	}

	getRemoteUserModesAsString() {
		return this.getRemoteServerDetails().getUserModesAsString();
	}

	setRemoteChannelModesFromString(channel_modes_string) {
		this.getRemoteServerDetails().setChannelModesFromString(
			channel_modes_string
		);
	}

	getLocalChannelModesAsString() {
		return this.getLocalServerDetails().getChannelModesAsString();
	}

	getRemoteChannelModesAsString() {
		return this.getRemoteServerDetails().getChannelModesAsString();
	}

	setRemoteChannelUserModesFromString(channel_user_modes_string) {
		this.getRemoteServerDetails().setChannelUserModesFromString(
			channel_user_modes_string
		);
	}

	getLocalChannelUserModesAsString() {
		return this.getLocalServerDetails().getChannelUserModesAsString();
	}

	applyParsedParameters(middle_parameters) {
		this.addTargetFromString(middle_parameters[0]);

		this.setRemoteHostname(middle_parameters[1]);
		this.setRemoteVersion(middle_parameters[2]);
		this.setRemoteUserModesFromString(middle_parameters[3]);
		this.setRemoteChannelModesFromString(middle_parameters[4]);
	}

	serializeParameters() {
		var
			targets            = this.serializeTargets(),
			hostname           = this.getLocalHostname(),
			version            = this.getLocalVersion(),
			user_modes         = this.getLocalUserModesAsString(),
			channel_modes      = this.getLocalChannelModesAsString(),
			channel_user_modes = this.getLocalChannelUserModesAsString();

		// TODO:
		// InspIRCd returns an additional mode list parameter here,
		// denoting those channel modes that require parameters.
		// Should we mimic that functionality? Do other IRCDs do the same?

		return `${targets} ${hostname} ${version} ${user_modes} ${channel_modes}${channel_user_modes}`;
	}

}

extend(MyInfoMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_MYINFO

});

module.exports = MyInfoMessage;
