var
	has = require('./has');

function extend(target, source, keys_to_omit, throw_error_on_collision) {
	var key;

	for (key in source) {
		if (has(keys_to_omit, key)) {
			continue;
		}

		if (target[key] !== undefined && throw_error_on_collision) {
			throw new Error('Collision at property key: ' + key);
		}

		target[key] = source[key];
	}

	return target;
}

module.exports = extend;
