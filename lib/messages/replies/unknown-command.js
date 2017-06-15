
var
	extend              = req('/lib/utilities/extend'),
	ReplyMessage        = req('/lib/messages/reply'),
	Replies             = req('/lib/constants/replies'),
	InvalidCommandError = req('/lib/errors/invalid-command'),
	ErrorReasons        = req('/lib/constants/error-reasons');


class UnknownCommandMessage extends ReplyMessage {

	setCommand(command) {
		this.command = command;
	}

	getCommand() {
		return this.command;
	}

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			command = this.getCommand(),
			body    = this.getBody();

		return `${targets} ${command} :${body}`;
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());
		this.setCommand(middle_parameters.shift());
		this.setBody(trailing_parameter);
	}

	toError() {
		return new InvalidCommandError(
			this.getCommand(),
			ErrorReasons.UNKNOWN_TYPE
		);
	}

}

extend(UnknownCommandMessage.prototype, {
	reply:   Replies.ERR_UNKNOWNCOMMAND,
	body:    'Unknown command',
	command: null
});

module.exports = UnknownCommandMessage;
