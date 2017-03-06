
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidSourceError extends BaseError {

	setMessage() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				this.message = 'Must supply a source';
				break;

			case ErrorReasons.UNKNOWN_TYPE:
			default:
				this.message = 'Unrecognized source type: ' + this.value;
				break;
		}
	}

}

extend(InvalidSourceError.prototype, {
	code: ErrorCodes.INVALID_SOURCE
});

module.exports = InvalidSourceError;
