var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');


class InvalidHostnameError extends BaseError {

	getBody() {
		return 'Invalid hostname: ' + this.value;
	}

}

extend(InvalidHostnameError.prototype, {
	code: ErrorCodes.INVALID_HOSTNAME
});

module.exports = InvalidHostnameError;
