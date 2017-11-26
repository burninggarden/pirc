var isInt = require('../utility/is-int');

function validate(timestamp) {
	if (!isInt(timestamp)) {
		throw new Error('Invalid timestamp: ' + timestamp);
	}

	if (timestamp < 0) {
		throw new Error('Invalid timestamp: ' + timestamp);
	}
}

module.exports = {
	validate
};
