
var
	IRCParser = req('/lib/parsers/irc');

module.exports = IRCParser.getParserForRule('host');
