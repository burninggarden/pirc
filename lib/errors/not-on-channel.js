
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class NotInChannelError extends BaseError {

	getBody() {
		return 'Not in channel: ' + this.value;
	}

}

extend(NotInChannelError.prototype, {
	code:   ErrorCodes.NOT_IN_CHANNEL,
	reason: ErrorReasons.GENERIC
});

module.exports = NotInChannelError;
