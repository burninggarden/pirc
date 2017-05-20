
var
	isArray = req('/utilities/is-array'),
	add     = req('/utilities/add');


function unique(array) {
	if (!isArray(array)) {
		throw new Error(`Invalid value passed to unique(): ${typeof array}`);
	}

	var result = [ ];

	array.forEach(function each(value) {
		add(value).to(result);
	});

	return result;
}

module.exports = unique;
