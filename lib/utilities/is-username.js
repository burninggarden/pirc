
var
	UsernameParser = req('/lib/parsers/username');

function isUsername(value) {
	return UsernameParser.parse(value) !== null;
}

module.exports = isUsername;
