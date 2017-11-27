
var
	isFunction = require('../utility/is-function');

function validate(value) {
	if (!isFunction(value)) {
		throw new Error('Invalid callback: ' + value);
	}
}

module.exports = {
	validate
};
