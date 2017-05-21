var
	extend        = req('/lib/utilities/extend'),
	BaseError     = req('/lib/errors/base'),
	ErrorCodes    = req('/lib/constants/error-codes'),
	ErrorReasons  = req('/lib/constants/error-reasons'),
	Commands      = req('/lib/constants/commands'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class InvalidWhoParametersError extends BaseError {

	getCommand() {
		return Commands.WHO;
	}

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for WHO command: ' + this.value;

			default:
				return 'Invalid WHO parameters: ' + this.value;
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

extend(InvalidWhoParametersError.prototype, {
	code: ErrorCodes.INVALID_WHO_PARAMETERS
});

module.exports = InvalidWhoParametersError;
