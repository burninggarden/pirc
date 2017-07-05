

var
	has           = req('/lib/utilities/has'),
	ReplyNumerics = req('/lib/constants/reply-numerics');

function validate(reply_numeric) {
	if (!reply_numeric) {
		throw new Error('Invalid reply numeric: ' + reply_numeric);
	}

	if (!has(ReplyNumerics, reply_numeric)) {
		throw new Error('Invalid reply numeric: ' + reply_numeric);
	}
}

module.exports = {
	validate
};
