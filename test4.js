

global.req = require('req');

var WhoisServerMessage = req('/lib/server/messages/whois-server');

var message = new WhoisServerMessage();

var raw_message = ':verne.freenode.net 312 Pillartom danneu moon.freenode.net :Atlanta, GA, US';

message.setRawMessage(raw_message);

message.deserialize();

console.log(message.getTargetUserDetails().getServerName());
