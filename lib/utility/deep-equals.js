
var
	has         = require('./has'),
	isPrimitive = require('./is-primitive');


function deepEquals(a, b, seen) {
	var key;

	if (!a || !b) {
		return a === b;
	}

	for (key in a) {
		if (a[key] === b[key]) {
			continue;
		}

		if (isPrimitive(a[key]) || isPrimitive(b[key])) {
			return false;
		}

		if (!seen) {
			seen = [ ];
		} else if (has(seen, a[key])) {
			continue;
		}

		seen.push(a);

		if (!deepEquals(a[key], b[key], seen)) {
			return false;
		}
	}

	return true;
}

module.exports = deepEquals;
