var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');


class InvalidBodyError extends BaseError {

	setMessage() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				this.message = 'Must supply a message body';
				break;

			case ErrorReasons.WRONG_TYPE:
				this.message = 'Wrong type supplied for body: ' + this.body;
				break;
		}
	}

}

extend(InvalidBodyError.prototype, {
	code: ErrorCodes.INVALID_BODY
});

module.exports = InvalidBodyError;
