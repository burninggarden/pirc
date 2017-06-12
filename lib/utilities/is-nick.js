
var
	NickParser = req('/lib/parsers/nick');

function isNick(value) {
	return NickParser.parse(value) !== null;
}

module.exports = isNick;
