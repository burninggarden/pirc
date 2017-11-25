

function sanitize(string) {
	var
		index  = 0,
		result = '';

	while (index < string.length) {
		let character = string.charCodeAt(index);

		if (
			   (character >= 1  && character <= 9)
			|| (character >= 11 && character <= 12)
			|| (character >= 14 && character <= 31)
			|| (character >= 33 && character <= 57)
			|| (character >= 59 && character <= 4095)
		) {
			result += string[index];
		}

		index++;
	}

	return result;
}

module.exports = sanitize;
