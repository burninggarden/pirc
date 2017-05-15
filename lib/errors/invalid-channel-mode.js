
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidChannelModeError extends BaseError {

	getMessage() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.OMITTED:
				return 'Must supply a channel mode';
			case ErrorReasons.UNKNOWN_TYPE:
				return 'Unknown channel mode: ' + this.value;
			default:
				return 'Invalid channel mode';
		}
	}

}

extend(InvalidChannelModeError.prototype, {
	code: ErrorCodes.INVALID_CHANNEL_MODE
});

module.exports = InvalidChannelModeError;
