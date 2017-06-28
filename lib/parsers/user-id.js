
var
	MessageParser = req('/lib/parsers/message');

module.exports = MessageParser.getParserForRule('user_id');
