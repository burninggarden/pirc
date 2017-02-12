
var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidChannelUserPrefixError extends BaseError {

	setMessage() {
		this.message = 'Invalid channel user prefix: ' + this.value;
	}

}

extend(InvalidChannelUserPrefixError.prototype, {
	code: ErrorCodes.INVALID_CHANNEL_USER_PREFIX
});

module.exports = InvalidChannelUserPrefixError;
