
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidRealnameError extends BaseError {
	setMessage() {
		if (this.reason === ErrorReasons.OMITTED) {
			this.message = 'Must specify a realname';
		} else {
			this.message = 'Invalid realname: ' + this.value;
		}
	}
}

extend(InvalidRealnameError.prototype, {
	code: ErrorCodes.INVALID_REALNAME
});

module.exports = InvalidRealnameError;
