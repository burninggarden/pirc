
var
	isString                  = req('/utilities/is-string'),
	ErrorReasons              = req('/constants/error-reasons'),
	InvalidServerAddressError = req('/lib/errors/invalid-server-address');


function validate(address) {
	if (!address) {
		throw new InvalidServerAddressError(address, ErrorReasons.OMITTED);
	}

	if (!isString(address)) {
		throw new InvalidServerAddressError(address, ErrorReasons.WRONG_TYPE);
	}
}

module.exports = {
	validate: validate
};
