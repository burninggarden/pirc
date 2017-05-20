var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidServerPortError extends BaseError {

	getBody() {
		return 'Invalid server port: ' + this.value;
	}

}

extend(InvalidServerPortError.prototype, {
	code: ErrorCodes.INVALID_SERVER_PORT,
});

module.exports = InvalidServerPortError;
