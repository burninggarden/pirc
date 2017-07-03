
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	Replies      = req('/lib/constants/replies');


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
		switch (this.reason) {
			case ErrorReasons.INVALID_CHARACTERS:
			case ErrorReasons.OVER_MAXIMUM_LENGTH:
				let reply = this.createReply(Replies.ERR_ERRONEUSNICKNAME);

				reply.setNickname(this.getValue());

				return reply;

			default:
				throw new Error('Unsupported error reason: ' + this.reason);
		}
	}

}

extend(InvalidNicknameError.prototype, {
	code: ErrorCodes.INVALID_NICKNAME
});

module.exports = InvalidNicknameError;
