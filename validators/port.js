
var
	isNumber               = req('/utilities/is-number'),
	ErrorReasons           = req('/constants/error-reasons'),
	InvalidServerPortError = req('/lib/errors/invalid-server-port');


function validate(port) {
	if (!port) {
		throw new InvalidServerPortError(port, ErrorReasons.OMITTED);
	}

	if (!isNumber(port)) {
		throw new InvalidServerPortError(port, ErrorReasons.WRONG_TYPE);
	}
}

module.exports = {
	validate: validate
};
