
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');

class YourHostMessage extends ReplyMessage {

	getValuesForParameters() {
		return {
			server_name:    this.getServerName(),
			server_version: this.getServerVersion()
		};
	}

	setValuesFromParameters(parameters) {
		this.setServerName(parameters.get('server_name'));
		this.setServerVersion(parameters.get('server_version'));
	}

}

extend(YourHostMessage.prototype, {

	reply: Replies.RPL_YOURHOST,
	abnf:  '"Your host is " <server-name> ", running version " <server-version>'

});

module.exports = YourHostMessage;
