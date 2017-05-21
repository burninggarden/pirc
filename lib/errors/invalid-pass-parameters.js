var
	extend        = req('/lib/utilities/extend'),
	BaseError     = req('/lib/errors/base'),
	ErrorCodes    = req('/lib/constants/error-codes'),
	ErrorReasons  = req('/lib/constants/error-reasons'),
	Commands      = req('/lib/constants/commands'),
	ReplyNumerics = req('/lib/constants/reply-numerics');


class InvalidPassParametersError extends BaseError {

	getCommand() {
		return Commands.PASS;
	}

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for PASS command: ' + this.value;

			default:
				return 'Invalid PASS parameters: ' + this.value;
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

extend(InvalidPassParametersError.prototype, {
	code: ErrorCodes.INVALID_PASS_PARAMETERS
});

module.exports = InvalidPassParametersError;
