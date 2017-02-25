var req = require('req');

var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');


class InvalidChannelNameError extends BaseError {

	setMessage() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				this.message = 'You must specify a channel name';
				return;

			case ErrorReasons.INVALID_CHARACTERS:
				this.message = 'Invalid channel name: ' + this.value;
				return;

			case ErrorReasons.NOT_FOUND:
				this.message = 'Channel did not exist: ' + this.value;
				break;

			default:
				throw new Error('Invalid channel name: ' + this.reason);
		}
	}

}

extend(InvalidChannelNameError.prototype, {
	code: ErrorCodes.INVALID_CHANNEL_NAME
});

module.exports = InvalidChannelNameError;
