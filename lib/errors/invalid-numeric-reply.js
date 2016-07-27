var req = require('req');

var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidNumericReplyError extends BaseError {

	setMessage() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				this.message = 'Must specify a numeric reply';
				break;

			case ErrorReasons.WRONG_TYPE:
			default:
				this.message = `Invalid numeric reply: ${this.value}`;
				break;
		}
	}

}

extend(InvalidNumericReplyError.prototype, {
	code: ErrorCodes.INVALID_NUMERIC_REPLY
});

module.exports = InvalidNumericReplyError;
