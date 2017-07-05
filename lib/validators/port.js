
var isNumber = req('/lib/utilities/is-number');


function validate(port) {
	if (!port) {
		throw new Error('Invalid server port: ' + port);
	}

	if (!isNumber(port)) {
		throw new Error('Invalid server port: ' + port);
	}
}

module.exports = {
	validate: validate
};
