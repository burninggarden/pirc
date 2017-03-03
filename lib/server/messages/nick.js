
var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');


class ServerNickMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	getDesiredNick() {
		return this.desired_nick;
	}

	setDesiredNick(nick) {
		this.desired_nick = nick;
	}

	serializeParams() {
		return this.getDesiredNick();
	}

	applyParsedParams(middle_params, trailing_param) {
		if (!middle_params.length && trailing_param) {
			this.setDesiredNick(trailing_param);
		} else {
			this.setDesiredNick(middle_params[0]);
		}
	}

}

function fromInboundMessage(message) {
	var resultant_message = new this();

	resultant_message.setTargets(message.getTargets());
	resultant_message.setUserDetails(message.getUserDetails());
	resultant_message.setServerDetails(message.getServerDetails());
	resultant_message.setChannelDetails(message.getChannelDetails());
	resultant_message.setDesiredNick(message.getDesiredNick());
	resultant_message.setBody(message.getBody());

	return resultant_message;
}

ServerNickMessage.fromInboundMessage = fromInboundMessage;

extend(ServerNickMessage.prototype, {
	command:      Commands.NICK,
	desired_nick: null

});

module.exports = ServerNickMessage;
