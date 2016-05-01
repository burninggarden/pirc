var req = require('req');

var
	isString               = req('/utilities/is-string'),
	InvalidServerNameError = req('/lib/errors/invalid-server-name'),
	ErrorReasons           = req('/constants/error-reasons');


function validate(server_name) {
	if (!server_name) {
		throw new InvalidServerNameError(server_name, ErrorReasons.OMITTED);
	}

	if (!isString(server_name)) {
		throw new InvalidServerNameError(server_name, ErrorReasons.WRONG_TYPE);
	}
}

module.exports = {
	validate: validate
};
