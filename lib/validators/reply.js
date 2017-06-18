

var
	has               = req('/lib/utilities/has'),
	Replies           = req('/lib/constants/replies'),
	InvalidReplyError = req('/lib/errors/invalid-reply'),
	ErrorReasons      = req('/lib/constants/error-reasons');

function validate(reply) {
	if (!reply) {
		throw new InvalidReplyError(null, ErrorReasons.OMITTED);
	}

	if (!has(Replies, reply)) {
		throw new InvalidReplyError(reply, ErrorReasons.WRONG_TYPE);
	}
}

module.exports = {
	validate
};
