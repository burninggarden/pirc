

var
	has                      = req('/utilities/has'),
	NumericReplies           = req('/constants/numeric-replies'),
	InvalidNumericReplyError = req('/lib/errors/invalid-numeric-reply'),
	ErrorReasons             = req('/constants/error-reasons');

function validate(numeric_reply) {
	if (!numeric_reply) {
		throw new InvalidNumericReplyError(null, ErrorReasons.OMITTED);
	}

	if (!has(NumericReplies, numeric_reply)) {
		throw new InvalidNumericReplyError(numeric_reply, ErrorReasons.WRONG_TYPE);
	}
}

module.exports = {
	validate
};
