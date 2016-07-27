var
	req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class NotInChannelError extends BaseError {

	setMessage() {
		this.message = 'Not in channel: ' + this.value;
	}

}

extend(NotInChannelError.prototype, {
	code: ErrorCodes.NOT_IN_CHANNEL
});

module.exports = NotInChannelError;
