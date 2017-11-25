
var
	extend       = req('/lib/utility/extend'),
	ReplyMessage = req('/lib/message/reply'),
	Enum_Replies = req('/lib/enum/replies');


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

	reply:             Enum_Replies.ERR_NEEDMOREPARAMS,
	abnf:              '<command> " :Not enough parameters"',
	attempted_command: null

});

module.exports = NeedMoreParametersMessage;
