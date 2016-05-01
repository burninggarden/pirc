var req = require('req');

var
	isArray = req('/utilities/is-array');

function has(object_or_array, value) {
	if (isArray(object_or_array)) {
		return object_or_array.indexOf(value) !== -1;
	}

	var key;

	for (key in object_or_array) {
		if (object_or_array[key] === value) {
			return true;
		}
	}

	return false;
}

module.exports = has;
