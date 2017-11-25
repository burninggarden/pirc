
var
	NicknameParser = req('/lib/parser/nickname');

function isNickname(value) {
	return NicknameParser.parseSafe(value) !== null;
}

module.exports = isNickname;
