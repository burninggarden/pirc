

function flatten(array) {
	var
		index            = 0,
		flattened_result = [ ];

	while (index < array.length) {
		let child_array = array[index];

		flattened_result = flattened_result.concat(child_array);

		index++;
	}

	return flattened_result;
}

module.exports = flatten;
