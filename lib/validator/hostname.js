
var Parser_Hostname = require('../parser/hostname');

function validate(hostname) {
	if (!hostname) {
		throw new Error('Invalid hostname: ' + hostname);
	}

	if (Parser_Hostname.parseSafe(hostname) === null) {
		throw new Error('Invalid hostname: ' + hostname);
	}
}

module.exports = {
	validate
};
