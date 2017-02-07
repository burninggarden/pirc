var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');


class ServerPrivateMessage extends ServerMessage {

	isFromServer() {
		return false;
	}

	isFromClient() {
		return true;
	}

	serializeParams() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		return `${targets} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.setTargetStrings(middle_params);
		this.setBody(trailing_param);
	}

	toChannelEvent() {
		return {
			channel: this.getChannelName(),
			nick:    this.getNick(),
			body:    this.getBody()
		};
	}

	toEvent() {
		if (this.hasChannelName()) {
			return this.toChannelEvent();
		} else {
			throw new Error('implement pms');
		}
	}

}

extend(ServerPrivateMessage.prototype, {
	command: Commands.PRIVMSG

});


ServerPrivateMessage.fromInboundMessage = function fromInboundMessage(message) {
	var resultant_message = new ServerPrivateMessage();

	resultant_message.setTargets(message.getTargets());
	resultant_message.setUserDetails(message.getUserDetails());
	resultant_message.setServerDetails(message.getServerDetails());
	resultant_message.setChannelDetails(message.getChannelDetails());
	resultant_message.setBody(message.getBody());

	return resultant_message;
};


module.exports = ServerPrivateMessage;
