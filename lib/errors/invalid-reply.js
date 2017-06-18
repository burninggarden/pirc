
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');


class InvalidReplyError extends BaseError {

	getBody() {
		switch (this.getReason()) {
			case ErrorReasons.OMITTED:
				return 'Must specify a reply';
			case ErrorReasons.WRONG_TYPE:
			default:
				return 'Invalid reply: ' + this.value;
		}
	}

}

extend(InvalidReplyError.prototype, {
	code: ErrorCodes.INVALID_REPLY
});

module.exports = InvalidReplyError;
