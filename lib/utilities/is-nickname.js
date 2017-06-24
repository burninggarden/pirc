
var
	NicknameParser = req('/lib/parsers/nickname');

function isNickname(value) {
	return NicknameParser.parse(value) !== null;
}

module.exports = isNickname;
