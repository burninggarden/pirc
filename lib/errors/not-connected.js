var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class NotConnectedError extends BaseError {

	getBody() {
		return 'Not connected to server';
	}

}

extend(NotConnectedError.prototype, {
	code:   ErrorCodes.NOT_CONNECTED,
	reason: ErrorReasons.GENERIC
});

module.exports = NotConnectedError;
