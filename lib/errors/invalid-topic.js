var
	extend     = req('/lib/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');


class InvalidTopicError extends BaseError {

	getBody() {
		return 'Invalid topic: ' + this.value;
	}

}

extend(InvalidTopicError.prototype, {
	code: ErrorCodes.INVALID_TOPIC
});

module.exports = InvalidTopicError;
