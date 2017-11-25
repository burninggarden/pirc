
var
	isArray = req('/lib/utility/is-array');


function isObject(value) {
	return (
		   value
		&& !isArray(value)
		&& typeof value === 'object'
	);
}


module.exports = isObject;
