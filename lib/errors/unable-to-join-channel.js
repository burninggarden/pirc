var
	req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class UnableToJoinChannelError extends BaseError {

	setMessage() {
		var
			value  = this.value,
			reason = this.reason;

		this.message = `Unable to join channel: ${value} (${reason})`;
	}

}

extend(UnableToJoinChannelError.prototype, {
	code: ErrorCodes.UNABLE_TO_JOIN_CHANNEL
});

module.exports = UnableToJoinChannelError;
