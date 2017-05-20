var
	isInt = req('/lib/utilities/is-int');

var
	InvalidTimestampError = req('/lib/errors/invalid-timestamp');

function validate(timestamp) {
	if (!isInt(timestamp)) {
		throw new InvalidTimestampError(timestamp);
	}

	if (timestamp < 0) {
		throw new InvalidTimestampError(timestamp);
	}
}

module.exports = {
	validate
};
