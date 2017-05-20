
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class NoServerConnectionError extends BaseError {

	getBody() {
		return 'No server connection';
	}

}

extend(NoServerConnectionError.prototype, {
	code:   ErrorCodes.NO_SERVER_CONNECTION,
	reason: ErrorReasons.GENERIC
});

module.exports = NoServerConnectionError;
