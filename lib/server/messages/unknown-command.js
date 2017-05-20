
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

	serializeParams() {
		var
			targets = this.serializeTargets(),
			command = this.getCommand(),
			body    = this.getBody();

		return `${targets} ${command} :${body}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());
		this.setCommand(middle_params.shift());
		this.setBody(trailing_param);
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
