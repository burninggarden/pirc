var
	isNumber = req('/lib/utility/is-number');

function isInt(value) {
	return isNumber(value) && parseInt(value) === value;
}

module.exports = isInt;
