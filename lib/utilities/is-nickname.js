
var
	NicknameParser = req('/lib/parsers/nickname');

function isNickname(value) {
	return NicknameParser.parseSafe(value) !== null;
}

module.exports = isNickname;
