
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidUsernameError extends BaseError {

	setMessage() {
		if (this.reason === ErrorReasons.OMITTED) {
			this.message = 'Must specify a username';
		} else {
			this.message = 'Invalid username: ' + this.value;
		}
	}

}

extend(InvalidUsernameError.prototype, {
	code: ErrorCodes.INVALID_USERNAME
});

module.exports = InvalidUsernameError;
