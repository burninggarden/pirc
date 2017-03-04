
var
	extend              = req('/utilities/extend'),
	ServerMessage       = req('/lib/server/message'),
	ReplyNumerics       = req('/constants/reply-numerics'),
	CommandValidator    = req('/validators/command'),
	ErrorReasons        = req('/constants/error-reasons'),
	InvalidCommandError = req('/lib/errors/invalid-command');


class NeedMoreParamsMessage extends ServerMessage {

	setAttemptedCommand(command) {
		CommandValidator.validate(command);
		this.attempted_command = command;
	}

	getAttemptedCommand() {
		CommandValidator.validate(this.attempted_command);
		return this.command;
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

	reply_numeric: ReplyNumerics.ERR_NEEDMOREPARAMS,
	body:          'Not enough parameters.'

});

module.exports = NeedMoreParamsMessage;
