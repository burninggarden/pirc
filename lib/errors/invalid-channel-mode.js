
var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidChannelModeError extends BaseError { }

extend(InvalidChannelModeError.prototype, {
	code: ErrorCodes.INVALID_CHANNEL_MODE
});

module.exports = InvalidChannelModeError;
