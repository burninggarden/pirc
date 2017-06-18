
var
	extend              = req('/lib/utilities/extend'),
	ReplyMessage        = req('/lib/messages/reply'),
	Replies             = req('/lib/constants/replies'),
	CommandValidator    = req('/lib/validators/command'),
	ErrorReasons        = req('/lib/constants/error-reasons'),
	InvalidCommandError = req('/lib/errors/invalid-command');


class NeedMoreParametersMessage extends ReplyMessage {

	setAttemptedCommand(command) {
		CommandValidator.validate(command);
		this.attempted_command = command;
	}

	getAttemptedCommand() {
		CommandValidator.validate(this.attempted_command);
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
	body:              'Not enough parameters.',
	attempted_command: null

});

module.exports = NeedMoreParametersMessage;
