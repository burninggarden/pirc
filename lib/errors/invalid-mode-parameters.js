
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidModeParametersError extends BaseError {

	setMessage() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				this.message = 'Not enough parameters for mode: ' + this.value;
				break;

			case ErrorReasons.TOO_MANY_PARAMETERS:
				this.message = 'Too many parameters for mode: ' + this.value;
				break;

			default:
				throw new Error(`
					Invalid reason when setting InvalidModeParameters message:
					${reason}
				`);
		}
	}

}

extend(InvalidModeParametersError.prototype, {
	code: ErrorCodes.INVALID_MODE_PARAMETERS
});

module.exports = InvalidModeParametersError;
