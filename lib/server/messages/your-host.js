
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

class ServerYourHostMessage extends ServerMessage {

	getBody() {
		var
			server_details = this.getLocalServerDetails(),
			hostname       = server_details.getHostname(),
			version        = server_details.getVersion();

		return `Your host is ${hostname}, running version ${version}`;
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
