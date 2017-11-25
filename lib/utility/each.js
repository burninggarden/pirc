
var
	isArray = req('/lib/utility/is-array');

function each(array_or_object, callback, context) {
	if (isArray(array_or_object)) {
		return array_or_object.forEach(callback, context);
	}

	Object.keys(array_or_object).forEach(function each(key) {
		var value = array_or_object[key];

		callback.call(context, key, value);
	});
}

module.exports = each;
