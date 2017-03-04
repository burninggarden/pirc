
global.req = require('req');

var NeedMoreParamsMessage = req('/lib/server/messages/need-more-params');

var message = new NeedMoreParamsMessage();

var raw_message = ':irc.burninggarden.com 461 stonefare MODE :Not enough parameters.';

message.setRawMessage(raw_message);
message.deserialize();

console.log(message.getAttemptedCommand());
