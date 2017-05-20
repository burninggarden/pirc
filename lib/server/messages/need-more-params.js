
var
	extend              = req('/lib/utilities/extend'),
	ServerMessage       = req('/lib/server/message'),
	ReplyNumerics       = req('/lib/constants/reply-numerics'),
	CommandValidator    = req('/validators/command'),
	ErrorReasons        = req('/lib/constants/error-reasons'),
	InvalidCommandError = req('/lib/errors/invalid-command');


class NeedMoreParamsMessage extends ServerMessage {

	setAttemptedCommand(command) {
		CommandValidator.validate(command);
		this.attempted_command = command;
	}

	getAttemptedCommand() {
		CommandValidator.validate(this.attempted_command);
		return this.attempted_command;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setAttemptedCommand(middle_params.shift());
		this.setBody(trailing_param);
	}

	serializeParams() {
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

extend(NeedMoreParamsMessage.prototype, {

	reply_numeric:     ReplyNumerics.ERR_NEEDMOREPARAMS,
	body:              'Not enough parameters.',
	attempted_command: null

});

module.exports = NeedMoreParamsMessage;
