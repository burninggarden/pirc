
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class MyInfoMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			server_name:    this.getServerName(),
			server_version: this.getServerVersion(),
			user_mode:      this.getUserModes(),
			channel_mode:   this.getChannelModes()
		};
	}

	setValuesFromParameters(parameters) {
		this.setServerName(parameters.get('server_name'));
		this.setServerVersion(parameters.get('server_version'));
		this.setUserModes(parameters.getAll('user_mode'));
		this.setChannelModes(parameters.getAll('channel_modes'));
	}

}

extend(MyInfoMessage.prototype, {

	reply: Replies.RPL_MYINFO

});

module.exports = MyInfoMessage;
