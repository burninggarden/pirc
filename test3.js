global.req = require('req');

var MessageParser = req('/lib/server/message-parser');

var raw_message = 'MODE';

MessageParser.parse(raw_message);
