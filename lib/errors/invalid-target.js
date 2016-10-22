var req = require('req');

var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidTargetError extends BaseError {

	setMessage() {
		switch (this.reason) {
			case ErrorReasons.UNKNOWN_TYPE:
				this.message = 'Unrecognized target type: ' + this.value;
				break;

			case ErrorReasons.OMITTED:
				this.message = 'Must supply a target type';
				break;

			case ErrorReasons.WRONG_FORMAT:
			default:
				this.message = 'Invalid target string: ' + this.value;
				break;
		}
	}

}

extend(InvalidTargetError.prototype, {
	code: ErrorCodes.INVALID_TARGET
});

module.exports = InvalidTargetError;
