
var req = require('req');

var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');

class InvalidChannelNickPrefixError extends BaseError {

	setMessage() {
		this.message = 'Invalid channel nick prefix: ' + this.value;
	}

}

extend(InvalidChannelNickPrefixError.prototype, {
	code: ErrorCodes.INVALID_CHANNEL_NICK_PREFIX
});

module.exports = InvalidChannelNickPrefixError;
