
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');


class AlreadyInChannelError extends BaseError {

	setMessage() {
		this.message = 'Already in channel: ' + this.value;
	}

}

extend(AlreadyInChannelError.prototype, {
	code:   ErrorCodes.ALREADY_IN_CHANNEL,
	reason: ErrorReasons.GENERIC
});

module.exports = AlreadyInChannelError;
