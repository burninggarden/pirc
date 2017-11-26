

var
	has                = require('../utility/has'),
	Enum_ReplyNumerics = require('../enum/reply-numerics');

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
