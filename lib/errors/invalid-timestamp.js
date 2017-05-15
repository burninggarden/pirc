var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');


class InvalidTimestampError extends BaseError {

	getMessage() {
		return 'Invalid timestamp: ' + this.value;
	}

}

extend(InvalidTimestampError.prototype, {
	code: ErrorCodes.INVALID_TIMESTAMP
});

module.exports = InvalidTimestampError;
