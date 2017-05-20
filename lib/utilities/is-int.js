var
	isNumber = req('/lib/utilities/is-number');

function isInt(value) {
	return isNumber(value) && parseInt(value) === value;
}

module.exports = isInt;
