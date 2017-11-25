
var
	MessageParser = req('/lib/parser/message');

module.exports = MessageParser.getParserForRule('user_id');
