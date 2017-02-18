

global.req = require('req');

var ModeMessage = req('/lib/server/messages/mode');

var message = new ModeMessage();

var raw_message = ':ChanServ!ChanServ@services. MODE #breadfish.de +v Elvisharc';

message.setRawMessage(raw_message);

message.deserialize();
