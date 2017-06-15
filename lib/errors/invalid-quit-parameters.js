var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	Commands     = req('/lib/constants/commands'),
	Replies      = req('/lib/constants/replies');


class InvalidQuitParametersError extends BaseError {

	getCommand() {
		return Commands.QUIT;
	}

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for QUIT command: ' + this.value;

			default:
				return 'Invalid QUIT parameters: ' + this.value;
		}
	}

	toReply() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return this.createReply(Replies.ERR_NEEDMOREPARAMS);

			default:
				throw new Error('implement: ' + reason);
		}
	}

}

extend(InvalidQuitParametersError.prototype, {
	code: ErrorCodes.INVALID_QUIT_PARAMETERS
});

module.exports = InvalidQuitParametersError;
