

function isPrimitive(value) {
	if (!value) {
		return true;
	}

	switch (typeof value) {
		case 'string':
		case 'number':
		case 'boolean':
			return true;

		default:
			return false;
	}
}

module.exports = isPrimitive;
