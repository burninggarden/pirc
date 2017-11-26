
var
	UsernameParser = require('../parser/username');

function isUsername(value) {
	return UsernameParser.parseSafe(value) !== null;
}

module.exports = isUsername;
