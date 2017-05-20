
function getValues(object) {
	var
		result = [ ],
		key;

	for (key in object) {
		result.push(object[key]);
	}

	return result;
}

module.exports = getValues;
