
var
	MessageParser = req('/lib/parser/message');

module.exports = MessageParser.getParserForRule('channel_name');
