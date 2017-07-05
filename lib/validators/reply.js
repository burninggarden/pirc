

var
	has     = req('/lib/utilities/has'),
	Replies = req('/lib/constants/replies');

function validate(reply) {
	if (!reply) {
		throw new Error('Invalid reply: ' + reply);
	}

	if (!has(Replies, reply)) {
		throw new Error('Invalid reply: ' + reply);
	}
}

module.exports = {
	validate
};
