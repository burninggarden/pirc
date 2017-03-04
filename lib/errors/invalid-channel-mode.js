
var req = require('req');

var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidChannelModeError extends BaseError {

	setMessage() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.OMITTED:
				this.message = 'Must supply a channel mode';
				break;

			case ErrorReasons.UNKNOWN_TYPE:
			default:
				this.message = 'Unknown channel mode: ' + this.value;
				break;
		}
	}

}

extend(InvalidChannelModeError.prototype, {
	code: ErrorCodes.INVALID_CHANNEL_MODE
});

module.exports = InvalidChannelModeError;
