
var
	isArray = req('/utilities/is-array');


function isObject(value) {
	return (
		   value
		&& !isArray(value)
		&& typeof value === 'object'
	);
}


module.exports = isObject;
