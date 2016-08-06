var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');


class InvalidHostnameError extends BaseError {

	setMessage() {
		this.message = 'Invalid hostname: ' + this.value;
	}

}

extend(InvalidHostnameError.prototype, {
	code: ErrorCodes.INVALID_HOSTNAME
});

module.exports = InvalidHostnameError;
