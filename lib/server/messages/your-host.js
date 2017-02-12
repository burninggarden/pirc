var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/constants/reply-numerics');

class ServerYourHostMessage extends ServerMessage {

	getBody() {
		var
			server_details = this.getServerDetails(),
			server_name    = server_details.getName(),
			version        = server_details.getVersion();

		return `Your host is ${server_name}, running version ${version}`;
	}

	serializeParams() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

}

extend(ServerYourHostMessage.prototype, {

	reply_numeric: ReplyNumerics.RPL_YOURHOST

});

module.exports = ServerYourHostMessage;
