
var defer = req('/lib/utilities/defer');

function deferOrThrow(callback, error) {
	if (!callback) {
		throw error;
	}

	return defer(callback, error);
}

module.exports = deferOrThrow;
