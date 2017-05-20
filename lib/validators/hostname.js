
var
	InvalidHostnameError = req('/lib/errors/invalid-hostname'),
	ErrorReasons         = req('/lib/constants/error-reasons');

function validate(hostname) {
	if (!hostname) {
		throw new InvalidHostnameError(hostname, ErrorReasons.OMITTED);
	}
}

module.exports = {
	validate
};
