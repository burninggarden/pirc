var
	extend     = req('/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/constants/error-codes');


class InvalidTopicError extends BaseError {

	getBody() {
		return 'Invalid topic: ' + this.value;
	}

}

extend(InvalidTopicError.prototype, {
	code: ErrorCodes.INVALID_TOPIC
});

module.exports = InvalidTopicError;
