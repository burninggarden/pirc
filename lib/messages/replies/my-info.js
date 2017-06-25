
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class MyInfoMessage extends ReplyMessage {

	getHostname() {
		return this.hostname;
	}

	setHostname(hostname) {
		this.hostname = hostname;
		return this;
	}

	getServerVersion() {
		return this.server_version;
	}

	setServerVersion(server_version) {
		this.server_version = server_version;
		return this;
	}

	getUserModes() {
		return this.user_modes;
	}

	setUserModes(user_modes) {
		this.user_modes = user_modes;
		return this;
	}

	getChannelModes() {
		return this.channel_modes;
	}

	setChannelModes(channel_modes) {
		this.channel_modes = channel_modes;
		return this;
	}

	getValuesForParameters() {
		return {
			hostname:       this.getHostname(),
			server_version: this.getServerVersion(),
			user_mode:      this.getUserModes(),
			channel_mode:   this.getChannelModes()
		};
	}

	setValuesFromParameters(parameters) {
		this.setHostname(parameters.get('hostname'));
		this.setServerVersion(parameters.get('server_version'));
		this.setUserModes(parameters.getAll('user_mode'));
		this.setChannelModes(parameters.getAll('channel_modes'));
	}

}

extend(MyInfoMessage.prototype, {

	reply: Replies.RPL_MYINFO,
	abnf:  '<hostname> " " <server-version> " " 1*<user-mode> " " 1*<channel-mode>'

});

module.exports = MyInfoMessage;
