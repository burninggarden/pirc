
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');


class AlreadyInChannelError extends BaseError {

	getBody() {
		return 'Already in channel: ' + this.value;
	}

}

extend(AlreadyInChannelError.prototype, {
	code:   ErrorCodes.ALREADY_IN_CHANNEL,
	reason: ErrorReasons.GENERIC
});

module.exports = AlreadyInChannelError;
