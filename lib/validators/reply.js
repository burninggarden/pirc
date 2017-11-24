

var
	has          = req('/lib/utilities/has'),
	Enum_Replies = req('/lib/enum/replies');

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
