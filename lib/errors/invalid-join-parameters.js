var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons'),
	Commands     = req('/constants/commands');

class InvalidJoinParametersError extends BaseError {

	getCommand() {
		return Commands.JOIN;
	}

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for JOIN command: ' + this.value;

			default:
				return 'Invalid JOIN parameters: ' + this.value;
		}
	}

}

extend(InvalidJoinParametersError.prototype, {
	code: ErrorCodes.INVALID_JOIN_PARAMETERS
});

module.exports = InvalidJoinParametersError;
