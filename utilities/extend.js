var
	has = require('./has');

function extend(target, source, keys_to_omit) {
	var key;

	for (key in source) {
		if (!has(keys_to_omit, key)) {
			target[key] = source[key];
		}
	}

	return target;
}

module.exports = extend;
