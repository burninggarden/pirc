
var
	extend              = req('/lib/utilities/extend'),
	ReplyMessage        = req('/lib/messages/reply'),
	ReplyNumerics       = req('/lib/constants/reply-numerics'),
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

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());
		this.setAttemptedCommand(middle_parameters.shift());
		this.setBody(trailing_parameter);
	}

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			command = this.getAttemptedCommand(),
			body    = this.getBody();

		if (targets.length === 0) {
			console.log('WTF???');
			throw new Error('invalid serialized targets');
		}

		return `${targets} ${command} :${body}`;
	}

	toError() {
		return new InvalidCommandError(
			this.getAttemptedCommand(),
			ErrorReasons.NOT_ENOUGH_PARAMETERS
		);
	}

}

extend(NeedMoreParametersMessage.prototype, {

	reply_numeric:     ReplyNumerics.ERR_NEEDMOREPARAMS,
	body:              'Not enough parameters.',
	attempted_command: null

});

module.exports = NeedMoreParametersMessage;
