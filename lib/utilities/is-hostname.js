
var
	HostnameParser = req('/lib/parsers/hostname');

function isHostname(value) {
	return HostnameParser.parse(value) !== null;
}

module.exports = isHostname;
