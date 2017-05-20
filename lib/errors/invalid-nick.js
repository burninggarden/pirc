
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class InvalidNickError extends BaseError {

	getBody() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				return 'Must specify a nick';
			case ErrorReasons.ALREADY_IN_USE:
				return 'Nick ' + this.value + ' is already in use';
			default:
				return 'Invalid nick: ' + this.value;
		}
	}

}

extend(InvalidNickError.prototype, {
	code: ErrorCodes.INVALID_NICK
});

module.exports = InvalidNickError;
