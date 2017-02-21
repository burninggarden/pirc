
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class NotInChannelError extends BaseError {

	setMessage() {
		this.message = 'Not in channel: ' + this.value;
	}

}

extend(NotInChannelError.prototype, {
	code:   ErrorCodes.NOT_IN_CHANNEL,
	reason: ErrorReasons.GENERIC
});

module.exports = NotInChannelError;
