
require('req');

var ModeMessage = require('./lib/messages/commands/mode');

var message = new ModeMessage();

message.setTargetType('channel');

message.addModeChangeFromString(' +nk aislingle');
