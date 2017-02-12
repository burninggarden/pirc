

global.req = require('req');

var WhoisChannelsMessage = req('/lib/server/messages/whois-channels');

var message = new WhoisChannelsMessage();

var raw_message = ':wolfe.freenode.net 319 Enshroudi tcsc :##javascript #Node.js';

message.setRawMessage(raw_message);

message.deserialize();

console.log(message.getChannelNames());
