
var
	extend              = req('/lib/utilities/extend'),
	ServerMessage       = req('/lib/server/message'),
	ReplyNumerics       = req('/lib/constants/reply-numerics'),
	InvalidCommandError = req('/lib/errors/invalid-command'),
	ErrorReasons        = req('/lib/constants/error-reasons');


class ServerUnknownCommandMessage extends ServerMessage {

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

extend(ServerUnknownCommandMessage.prototype, {
	reply_numeric: ReplyNumerics.ERR_UNKNOWNCOMMAND,
	body:          'Unknown command',
	command:       null
});

module.exports = ServerUnknownCommandMessage;
