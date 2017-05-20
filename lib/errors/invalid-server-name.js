var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidServerNameError extends BaseError {

	getBody() {
		return 'Invalid server name: ' + this.value;
	}

}

extend(InvalidServerNameError.prototype, {
	code: ErrorCodes.INVALID_SERVER_NAME
});

module.exports = InvalidServerNameError;
