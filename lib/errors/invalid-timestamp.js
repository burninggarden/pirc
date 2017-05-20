var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');


class InvalidTimestampError extends BaseError {

	getBody() {
		return 'Invalid timestamp: ' + this.value;
	}

}

extend(InvalidTimestampError.prototype, {
	code: ErrorCodes.INVALID_TIMESTAMP
});

module.exports = InvalidTimestampError;
