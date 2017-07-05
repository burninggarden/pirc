
var
	extend       = req('/lib/utilities/extend'),
	ReplyMessage = req('/lib/messages/reply'),
	Replies      = req('/lib/constants/replies');


class NeedMoreParametersMessage extends ReplyMessage {

	setAttemptedCommand(command) {
		this.attempted_command = command;
		return this;
	}

	getAttemptedCommand() {
		return this.attempted_command;
	}

	getValuesForParameters() {
		return {
			command: this.getAttemptedCommand()
		};
	}

	setValuesFromParameters(parameters) {
		this.setAttemptedCommand(parameters.get('command'));
		return this;
	}

}

extend(NeedMoreParametersMessage.prototype, {

	reply:             Replies.ERR_NEEDMOREPARAMS,
	abnf:              '<command> " :Not enough parameters"',
	attempted_command: null

});

module.exports = NeedMoreParametersMessage;
