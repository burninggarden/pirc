
var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class AlreadyListeningError extends BaseError { }

extend(AlreadyListeningError.prototype, {
	code: ErrorCodes.ALREADY_LISTENING
});

module.exports = AlreadyListeningError;
