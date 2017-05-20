
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class InvalidChannelModeError extends BaseError {

	getBody() {
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
