

function random(array) {
	var index = Math.floor(Math.random() * array.length);

	return array[index];
}

module.exports = random;
