
var
	isString = req('/lib/utilities/is-string');


function validate(address) {
	if (!address) {
		throw new Error('Invalid server address: ' + address);
	}

	if (!isString(address)) {
		throw new Error('Invalid server address: ' + address);
	}
}

module.exports = {
	validate: validate
};
