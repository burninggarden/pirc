
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');


class InvalidReplyNumericError extends BaseError {

	getBody() {
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
