
global.req = require('req');

var NoticeMessage = req('/lib/server/messages/notice');

console.log(NoticeMessage.fromInboundMessage);
