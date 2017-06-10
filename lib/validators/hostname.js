
var
	InvalidHostnameError = req('/lib/errors/invalid-hostname'),
	ErrorReasons         = req('/lib/constants/error-reasons'),
	HostnameParser       = req('/lib/parsers/hostname');

function validate(hostname) {
	if (!hostname) {
		throw new InvalidHostnameError(hostname, ErrorReasons.OMITTED);
	}

	if (HostnameParser.parse(hostname) === null) {
		throw new InvalidHostnameError(hostname, ErrorReasons.WRONG_FORMAT);
	}
}

module.exports = {
	validate
};
