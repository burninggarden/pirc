

global.req = require('req');

var WhoisUserMessage = req('/lib/server/messages/whois-user');

var message = new WhoisUserMessage();

var raw_message = ':hitchcock.freenode.net 311 Ichorrats tcsc ~sid721 2620:101:8016:74::5:2d1 * :tcsc';

message.setRawMessage(raw_message);

message.deserialize();
