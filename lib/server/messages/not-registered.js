
var
	extend             = req('/lib/utilities/extend'),
	has                = req('/lib/utilities/has'),
	ServerMessage      = req('/lib/server/message'),
	ReplyNumerics      = req('/lib/constants/reply-numerics'),
	Commands           = req('/lib/constants/commands'),
	NotRegisteredError = req('/lib/errors/not-registered');


class ServerNotRegisteredMessage extends ServerMessage {

	serializeParameters() {
		var
			targets = this.serializeTargets(),
			body    = this.getBody();

		if (this.hasAttemptedCommand()) {
			let attempted_command = this.getAttemptedCommand();

			return `${targets} ${attempted_command} :${body}`;
		} else {
			return `${targets} :${body}`;
		}
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		this.addTargetFromString(middle_parameters.shift());

		if (middle_parameters.length) {
			this.setAttemptedCommand(middle_parameters.shift());
		}

		this.setBody(trailing_parameter);
	}

	setAttemptedCommand(attempted_command) {
		if (!has(Commands, attempted_command)) {
			throw new Error(`
				Invalid command: ${attempted_command}
			`);
		}

		this.attempted_command = attempted_command;
	}

	getAttemptedCommand() {
		return this.attempted_command;
	}

	hasAttemptedCommand() {
		return this.getAttemptedCommand() !== null;
	}

	toError() {
		return new NotRegisteredError(this.getAttemptedCommand());
	}

}

extend(ServerNotRegisteredMessage.prototype, {
	reply_numeric:     ReplyNumerics.ERR_NOTREGISTERED,
	body:              'You have not registered',
	attempted_command: null
});

module.exports = ServerNotRegisteredMessage;
