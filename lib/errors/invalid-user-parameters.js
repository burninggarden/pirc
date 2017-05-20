var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons'),
	Commands     = req('/constants/commands');

class InvalidUserParametersError extends BaseError {

	getCommand() {
		return Commands.USER;
	}

	getMessage() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for USER command: ' + this.value;

			default:
				return 'Invalid USER parameters: ' + this.value;
		}
	}

}

extend(InvalidUserParametersError.prototype, {
	code: ErrorCodes.INVALID_USER_PARAMETERS
});

module.exports = InvalidUserParametersError;
