
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

	serializeParameters() {
		return ' ' + this.serializeTargets() + ' :' + this.getBody();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.setTargetStrings(middle_parameters);
		this.setBody(trailing_parameter);
	}

}

extend(ServerYourHostMessage.prototype, {

	bnf:           'Your host is <servername>, running version <ver>',
	reply_numeric: ReplyNumerics.RPL_YOURHOST

});

module.exports = ServerYourHostMessage;
