

var
	has                = req('/lib/utility/has'),
	Enum_ReplyNumerics = req('/lib/enum/reply-numerics');

function validate(reply_numeric) {
	if (!reply_numeric) {
		throw new Error('Invalid reply numeric: ' + reply_numeric);
	}

	if (!has(Enum_ReplyNumerics, reply_numeric)) {
		throw new Error('Invalid reply numeric: ' + reply_numeric);
	}
}

module.exports = {
	validate
};
