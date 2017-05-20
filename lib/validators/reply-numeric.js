

var
	has                      = req('/lib/utilities/has'),
	ReplyNumerics            = req('/lib/constants/reply-numerics'),
	InvalidReplyNumericError = req('/lib/errors/invalid-reply-numeric'),
	ErrorReasons             = req('/lib/constants/error-reasons');

function validate(reply_numeric) {
	if (!reply_numeric) {
		throw new InvalidReplyNumericError(null, ErrorReasons.OMITTED);
	}

	if (!has(ReplyNumerics, reply_numeric)) {
		throw new InvalidReplyNumericError(reply_numeric, ErrorReasons.WRONG_TYPE);
	}
}

module.exports = {
	validate
};