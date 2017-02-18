var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class NotConnectedError extends BaseError { }

extend(NotConnectedError.prototype, {
	code:   ErrorCodes.NOT_CONNECTED,
	reason: ErrorReasons.GENERIC
});

module.exports = NotConnectedError;
