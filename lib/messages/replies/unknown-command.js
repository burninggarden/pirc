
var
	extend              = req('/lib/utilities/extend'),
	ReplyMessage        = req('/lib/messages/reply'),
	Replies             = req('/lib/constants/replies'),
	InvalidCommandError = req('/lib/errors/invalid-command'),
	ErrorReasons        = req('/lib/constants/error-reasons');


class UnknownCommandMessage extends ReplyMessage {

	getAttemptedCommand() {
		return this.attempted_command;
	}

	setAttemptedCommand(attempted_command) {
		this.attempted_command = attempted_command;
		return this;
	}

	getValuesForParameters() {
		return {
			attempted_command: this.getAttemptedCommand()
		};
	}

	setValuesFromParameters(parameters) {
		this.setAttemptedCommand(parameters.get('attempted_command'));
	}

	toError() {
		return new InvalidCommandError(
			this.getAttemptedCommand(),
			ErrorReasons.UNKNOWN_TYPE
		);
	}

}

extend(UnknownCommandMessage.prototype, {
	reply:             Replies.ERR_UNKNOWNCOMMAND,
	abnf:              '<attempted-command> " :Unknown command"',
	attempted_command: null
});

module.exports = UnknownCommandMessage;
