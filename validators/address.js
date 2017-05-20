
var
	isString                  = req('/lib/utilities/is-string'),
	ErrorReasons              = req('/lib/constants/error-reasons'),
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
