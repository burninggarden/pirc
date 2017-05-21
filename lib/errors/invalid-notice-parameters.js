var
	extend        = req('/lib/utilities/extend'),
	BaseError     = req('/lib/errors/base'),
	ErrorCodes    = req('/lib/constants/error-codes'),
	ErrorReasons  = req('/lib/constants/error-reasons'),
	Commands      = req('/lib/constants/commands'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class InvalidNoticeParametersError extends BaseError {

	getCommand() {
		return Commands.NOTICE;
	}

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for NOTICE command: ' + this.value;

			default:
				return 'Invalid NOTICE parameters: ' + this.value;
		}
	}

	toReply() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return this.createReply(ReplyNumerics.ERR_NEEDMOREPARAMS);

			default:
				throw new Error('implement: ' + reason);
		}
	}

}

extend(InvalidNoticeParametersError.prototype, {
	code: ErrorCodes.INVALID_NOTICE_PARAMETERS
});

module.exports = InvalidNoticeParametersError;
