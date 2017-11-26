

var
	has          = require('../utility/has'),
	Enum_Replies = require('../enum/replies');

function validate(reply) {
	if (!reply) {
		throw new Error('Invalid reply: ' + reply);
	}

	if (!has(Enum_Replies, reply)) {
		throw new Error('Invalid reply: ' + reply);
	}
}

module.exports = {
	validate
};
