
var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidChannelUserPrefixError extends BaseError {

	getBody() {
		return 'Invalid channel user prefix: ' + this.value;
	}

}

extend(InvalidChannelUserPrefixError.prototype, {
	code: ErrorCodes.INVALID_CHANNEL_USER_PREFIX
});

module.exports = InvalidChannelUserPrefixError;
