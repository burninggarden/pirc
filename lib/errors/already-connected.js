var
	extend     = req('/lib/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class AlreadyConnectedError extends BaseError { }

extend(AlreadyConnectedError.prototype, {
	code: ErrorCodes.ALREADY_CONNECTED
});

module.exports = AlreadyConnectedError;
