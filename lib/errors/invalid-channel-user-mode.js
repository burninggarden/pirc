
var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidChannelUserModeError extends BaseError {

	getMessage() {
		return 'Invalid channel user mode: ' + this.value;
	}

}

extend(InvalidChannelUserModeError.prototype, {
	code: ErrorCodes.INVALID_CHANNEL_USER_MODE
});

module.exports = InvalidChannelUserModeError;
