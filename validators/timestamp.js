var
	isInt = req('/utilities/is-int');

function validate(timestamp) {
	if (!isInt(timestamp)) {
		throw new InvalidTimestampError(timestamp);
	}
}

module.exports = {
	validate
};
