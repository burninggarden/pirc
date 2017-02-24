
global.req = require('req');

var NoticeMessage = req('/lib/server/messages/notice');

var message = new NoticeMessage();

console.log(message.command);
