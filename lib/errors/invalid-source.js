
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class InvalidSourceError extends BaseError {

	getBody() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				return 'Must supply a source';
			case ErrorReasons.UNKNOWN_TYPE:
			default:
				return 'Unrecognized source type: ' + this.value;
		}
	}

}

extend(InvalidSourceError.prototype, {
	code: ErrorCodes.INVALID_SOURCE
});

module.exports = InvalidSourceError;
