
var
	UsernameParser = req('/lib/parsers/username');

function isUsername(value) {
	return UsernameParser.parseSafe(value) !== null;
}

module.exports = isUsername;
