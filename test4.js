

global.req = require('req');

var JoinMessage = req('/lib/server/messages/join');

// var Regexes = req('/constants/regexes');

var message = new JoinMessage();

var raw_message = ':WakiMiko!~WakiMiko@unaffiliated/wakimiko JOIN #Node.js';

message.setRawMessage(raw_message);

message.deserialize();
