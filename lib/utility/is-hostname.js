
var
	HostnameParser = req('/lib/parser/hostname');

function isHostname(value) {
	return HostnameParser.parseSafe(value) !== null;
}

module.exports = isHostname;
