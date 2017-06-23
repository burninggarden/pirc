
var
	extend              = req('/lib/utilities/extend'),
	ReplyMessage        = req('/lib/messages/reply'),
	Replies             = req('/lib/constants/replies'),
	ErrorReasons        = req('/lib/constants/error-reasons'),
	InvalidCommandError = req('/lib/errors/invalid-command');


class NeedMoreParametersMessage extends ReplyMessage {

	setAttemptedCommand(command) {
		this.attempted_command = command;
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
	}

	toError() {
		return new InvalidCommandError(
			this.getAttemptedCommand(),
			ErrorReasons.NOT_ENOUGH_PARAMETERS
		);
	}

}

extend(NeedMoreParametersMessage.prototype, {

	reply:             Replies.ERR_NEEDMOREPARAMS,
	abnf:              '<command> " :Not enough parameters"',
	attempted_command: null

});

module.exports = NeedMoreParametersMessage;
