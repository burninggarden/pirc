
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class InvalidModeParametersError extends BaseError {

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for mode: ' + this.value;
			case ErrorReasons.TOO_MANY_PARAMETERS:
				return 'Too many parameters for mode: ' + this.value;
			default:
				return 'Invalid mode parameter: ' + this.value;
		}
	}

}

extend(InvalidModeParametersError.prototype, {
	code: ErrorCodes.INVALID_MODE_PARAMETERS
});

module.exports = InvalidModeParametersError;
