
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidReplyNumericError extends BaseError {

	getMessage() {
		switch (this.getReason()) {
			case ErrorReasons.OMITTED:
				return 'Must specify a reply numeric';
			case ErrorReasons.WRONG_TYPE:
			default:
				return 'Invalid reply numeric: ' + this.value;
		}
	}

}

extend(InvalidReplyNumericError.prototype, {
	code: ErrorCodes.INVALID_REPLY_NUMERIC
});

module.exports = InvalidReplyNumericError;
