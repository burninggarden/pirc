var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	Commands     = req('/lib/constants/commands');

class InvalidNickParametersError extends BaseError {

	getCommand() {
		return Commands.NICK;
	}

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for NICK command: ' + this.value;

			default:
				return 'Invalid NICK parameters: ' + this.value;
		}
	}

}

extend(InvalidNickParametersError.prototype, {
	code: ErrorCodes.INVALID_NICK_PARAMETERS
});

module.exports = InvalidNickParametersError;
