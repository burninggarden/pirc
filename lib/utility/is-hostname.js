
var
	HostnameParser = require('../parser/hostname');

function isHostname(value) {
	return HostnameParser.parseSafe(value) !== null;
}

module.exports = isHostname;
