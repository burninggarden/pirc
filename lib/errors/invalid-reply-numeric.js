var req = require('req');

var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidReplyNumericError extends BaseError {

	setMessage() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				this.message = 'Must specify a reply numeric';
				break;

			case ErrorReasons.WRONG_TYPE:
			default:
				this.message = `Invalid reply numeric: ${this.value}`;
				break;
		}
	}

}

extend(InvalidReplyNumericError.prototype, {
	code: ErrorCodes.INVALID_REPLY_NUMERIC
});

module.exports = InvalidReplyNumericError;
