
var defer = require('./defer');

function deferOrThrow(callback, error) {
	if (!callback) {
		throw error;
	}

	return defer(callback, error);
}

module.exports = deferOrThrow;
