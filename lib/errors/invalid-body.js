var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');


class InvalidBodyError extends BaseError {

	getMessage() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				return 'Must supply a message body';

			case ErrorReasons.WRONG_TYPE:
				return 'Wrong type supplied for body: ' + this.body;

			default:
				return 'Invalid message body';
		}
	}

}

extend(InvalidBodyError.prototype, {
	code: ErrorCodes.INVALID_BODY
});

module.exports = InvalidBodyError;
