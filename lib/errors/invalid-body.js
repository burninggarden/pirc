var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');


class InvalidBodyError extends BaseError {

	getBody() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				return 'Must supply a message body';

			case ErrorReasons.WRONG_TYPE:
				return 'Wrong type supplied for body: ' + this.value;

			default:
				return 'Invalid message body';
		}
	}

}

extend(InvalidBodyError.prototype, {
	code: ErrorCodes.INVALID_BODY
});

module.exports = InvalidBodyError;
