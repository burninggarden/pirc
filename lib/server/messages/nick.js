
var
	extend        = req('/lib/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/lib/constants/commands');


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

	serializeParameters() {
		return this.getDesiredNick();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		if (!middle_parameters.length && trailing_parameter) {
			this.setDesiredNick(trailing_parameter);
		} else {
			this.setDesiredNick(middle_parameters[0]);
		}
	}

}

function fromInboundMessage(message) {
	var resultant_message = new this();

	resultant_message.setTargets(message.getTargets());
	resultant_message.setUserDetails(message.getUserDetails());
	resultant_message.setLocalServerDetails(message.getLocalServerDetails());
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
