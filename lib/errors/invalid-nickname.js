
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	Replies      = req('/lib/constants/replies'),
	Commands     = req('/lib/constants/commands');


class InvalidNicknameError extends BaseError {

	getBody() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				return 'Must specify a nickname';
			case ErrorReasons.ALREADY_IN_USE:
				return 'Nickname ' + this.value + ' is already in use';
			default:
				return 'Invalid nickname: ' + this.value;
		}
	}

	toReply() {
		var reply;

		switch (this.reason) {
			case ErrorReasons.INVALID_CHARACTERS:
			case ErrorReasons.OVER_MAXIMUM_LENGTH:
				reply = this.createReply(Replies.ERR_ERRONEUSNICKNAME);
				reply.setNickname(this.getValue());

				return reply;

			case ErrorReasons.NOT_FOUND:
				return this.toNotFoundReply();

			default:
				throw new Error('Unsupported error reason: ' + this.reason);
		}
	}

	toNotFoundReply() {
		var
			command = this.getCommand(),
			reply;

		switch (command) {
			case Commands.WHOWAS:
				reply = this.createReply(Replies.ERR_WASNOSUCHNICK);
				break;

			default:
				reply = this.createReply(Replies.ERR_NOSUCHNICK);
				break;
		}

		reply.setNickname(this.getValue());

		return reply;
	}

}

extend(InvalidNicknameError.prototype, {
	code: ErrorCodes.INVALID_NICKNAME
});

module.exports = InvalidNicknameError;
