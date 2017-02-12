var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerMyInfoMessage extends ServerMessage {

	setName(name) {
		this.getServerDetails().setName(name);
	}

	getName() {
		return this.getServerDetails().getName();
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
		var server_details = this.getServerDetails();

		server_details.setName(middle_params[0]);
		server_details.setVersion(middle_params[1]);
		server_details.setUserModesFromString(middle_params[2]);
		server_details.setChannelModesFromString(middle_params[3]);
	}

	serializeParams() {
		var
			server_details = this.getServerDetails(),
			name           = server_details.getName(),
			version        = server_details.getVersion(),
			user_modes     = server_details.getUserModesAsString(),
			channel_modes  = server_details.getChannelModesAsString();

		return `${name} ${version} ${user_modes} ${channel_modes}`;
	}

}

extend(ServerMyInfoMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_MYINFO

});

module.exports = ServerMyInfoMessage;
