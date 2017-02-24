var
	isFunction = req('/utilities/is-function');

function extendClass(target_class) {
	if (arguments.length !== 1) {
		throw new Error(`
			Incorrect number of arguments passed to extendClass()
		`);
	}

	function withInterface(source) {
		var keys = Object.getOwnPropertyNames(source.prototype);

		keys.forEach(function each(key) {
			target_class.prototype[key] = source.prototype[key];
		});

		while (source && source !== Function.prototype) {
			keys = Object.getOwnPropertyNames(source);

			keys.forEach(function each(key) {
				if (isFunction(source[key])) {
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
