
var HostnameParser = req('/lib/parsers/hostname');

function validate(hostname) {
	if (!hostname) {
		throw new Error('Invalid hostname: ' + hostname);
	}

	if (HostnameParser.parseSafe(hostname) === null) {
		throw new Error('Invalid hostname: ' + hostname);
	}
}

module.exports = {
	validate
};
