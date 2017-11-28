
var
	isString = require('../utility/is-string');

function validate(value) {
	if (!isString(value) || value.length === 0) {
		throw new Error('Invalid password: ' + value);
	}
}

module.exports = {
	validate
};
