
var
	isNumber = req('/utilities/is-number'),
	isArray  = req('/utilities/is-array'),
	isObject = req('/utilities/is-object');


function randomArrayElement(array) {
	return array[randomNumber(array.length)];
}

function randomNumber(number) {
	return Math.floor(Math.random() * number);
}

function randomObjectProperty(object) {
	var key = randomArrayElement(Object.keys(object));

	return object[key];
}

function random(value) {
	if (isNumber(value)) {
		return randomNumber(value);
	}

	if (isArray(value)) {
		return randomArrayElement(value);
	}

	if (isObject(value)) {
		return randomObjectProperty(value);
	}

	throw new Error(`Unsupported value passed to random(): ${value}`);
}

module.exports = random;
