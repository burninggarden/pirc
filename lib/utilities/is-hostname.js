
var
	HostnameParser = req('/lib/parsers/hostname');

function isHostname(value) {
	return HostnameParser.parseSafe(value) !== null;
}

module.exports = isHostname;
