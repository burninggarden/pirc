
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class NoServerConnectionError extends BaseError {

	getMessage() {
		return 'No server connection';
	}

}

extend(NoServerConnectionError.prototype, {
	code:   ErrorCodes.NO_SERVER_CONNECTION,
	reason: ErrorReasons.GENERIC
});

module.exports = NoServerConnectionError;
