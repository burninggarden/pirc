var
	has        = req('/lib/utility/has'),
	add        = req('/lib/utility/add'),
	isFunction = req('/lib/utility/is-function');

function extendClass(target_class) {
	if (arguments.length !== 1) {
		throw new Error(`
			Incorrect number of arguments passed to extendClass()
		`);
	}

	function withInterface(source) {
		var seen_keys = [ ];

		while (source && source !== Function.prototype) {
			let keys = Object.getOwnPropertyNames(source.prototype);

			keys.forEach(function each(key) {
				if (!has(seen_keys, key)) {
					target_class.prototype[key] = source.prototype[key];
					add(key).to(seen_keys);
				}
			});

			keys = Object.getOwnPropertyNames(source);

			keys.forEach(function each(key) {
				if (isFunction(source[key]) && !target_class[key]) {
					target_class[key] = source[key];
				}
			});

			source = Object.getPrototypeOf(source);
		}

		return target_class;
	}

	return {
		withInterface
	};
}


module.exports = extendClass;
