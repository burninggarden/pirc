
var
	extend              = req('/lib/utilities/extend'),
	ReplyMessage        = req('/lib/messages/reply'),
	Replies             = req('/lib/constants/replies'),
	InvalidCommandError = req('/lib/errors/invalid-command'),
	ErrorReasons        = req('/lib/constants/error-reasons');


class UnknownCommandMessage extends ReplyMessage {

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
			ErrorReasons.UNKNOWN_TYPE
		);
	}

}

extend(UnknownCommandMessage.prototype, {
	reply: Replies.ERR_UNKNOWNCOMMAND,
	abnf:  '<command> " :Unknown command"'
});

module.exports = UnknownCommandMessage;
