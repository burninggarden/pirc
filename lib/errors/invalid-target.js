
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class InvalidTargetError extends BaseError {

	getBody() {
		switch (this.getReason()) {
			case ErrorReasons.UNKNOWN_TYPE:
				return 'Unrecognized target type: ' + this.value;
			case ErrorReasons.OMITTED:
				return 'Must supply a target type';
			case ErrorReasons.WRONG_FORMAT:
			default:
				return 'Invalid target string: ' + this.value;
		}
	}

	toMessage() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.OMITTED:
				return this.createMessageForErrorCode(
					ErrorCodes.NOT_ENOUGH_PARAMETERS
				);

			default:
				return super.toMessage();
		}
	}

}

extend(InvalidTargetError.prototype, {
	code: ErrorCodes.INVALID_TARGET
});

module.exports = InvalidTargetError;
