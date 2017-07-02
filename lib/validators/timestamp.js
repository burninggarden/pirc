var
	isInt = req('/lib/utilities/is-int');

var
	InvalidTimestampError = req('/lib/errors/invalid-timestamp'),
	ErrorReasons          = req('/lib/constants/error-reasons');

function validate(timestamp) {
	if (!isInt(timestamp)) {
		throw new InvalidTimestampError(
			timestamp,
			ErrorReasons.WRONG_TYPE
		);
	}

	if (timestamp < 0) {
		throw new InvalidTimestampError(
			timestamp,
			ErrorReasons.WRONG_FORMAT
		);
	}
}

module.exports = {
	validate
};
