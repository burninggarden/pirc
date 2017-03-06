
var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidUserModeError extends BaseError {

	setMessage() {
		this.message = 'Invalid user mode: ' + this.value;
	}

}

extend(InvalidUserModeError.prototype, {
	code: ErrorCodes.INVALID_USER_MODE
});

module.exports = InvalidUserModeError;
