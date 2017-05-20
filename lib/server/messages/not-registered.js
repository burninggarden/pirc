
var
	extend             = req('/utilities/extend'),
	has                = req('/utilities/has'),
	ServerMessage      = req('/lib/server/message'),
	ReplyNumerics      = req('/lib/constants/reply-numerics'),
	Commands           = req('/lib/constants/commands'),
	NotRegisteredError = req('/lib/errors/not-registered');


class ServerNotRegisteredMessage extends ServerMessage {

	serializeParams() {
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

	applyParsedParams(middle_params, trailing_param) {
		this.addTargetFromString(middle_params.shift());

		if (middle_params.length) {
			this.setAttemptedCommand(middle_params.shift());
		}

		this.setBody(trailing_param);
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
