
var
	extend     = req('/lib/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidChannelModesError extends BaseError { }

extend(InvalidChannelModesError.prototype, {
	code: ErrorCodes.INVALID_CHANNEL_MODES
});

module.exports = InvalidChannelModesError;
