var
	req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class AlreadyInChannelError extends BaseError {

	setMessage() {
		this.message = 'Already in channel: ' + this.value;
	}

}

extend(AlreadyInChannelError.prototype, {
	code: ErrorCodes.ALREADY_IN_CHANNEL
});

module.exports = AlreadyInChannelError;
