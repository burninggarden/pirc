var req = require('req');

var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidResponseTypeError extends BaseError {

	setMessage() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				this.message = 'Must specify a response type';
				break;

			case ErrorReasons.WRONG_TYPE:
			default:
				this.message = `Invalid response type: ${this.value}`;
				break;
		}
	}

}

extend(InvalidResponseTypeError.prototype, {
	code: ErrorCodes.INVALID_RESPONSE_TYPE
});

module.exports = InvalidResponseTypeError;
