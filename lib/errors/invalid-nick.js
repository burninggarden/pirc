
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidNickError extends BaseError {

	setMessage() {
		if (this.reason === ErrorReasons.OMITTED) {
			this.message = 'Must specify a nick';
		} else if (this.reason === ErrorReasons.ALREADY_IN_USE) {
			this.message = 'Nick ' + this.value + ' is already in use';
		} else {
			this.message = 'Invalid nick: ' + this.value;
		}
	}

}

extend(InvalidNickError.prototype, {
	code: ErrorCodes.INVALID_NICK
});

module.exports = InvalidNickError;
