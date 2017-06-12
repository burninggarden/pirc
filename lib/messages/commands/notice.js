
var
	extendClass            = req('/lib/utilities/extend-class'),
	CommandMessage         = req('/lib/messages/command'),
	NoticeMessageInterface = req('/lib/interfaces/messages/notice');


class NoticeMessage extends CommandMessage {

}

extendClass(NoticeMessage).withInterface(NoticeMessageInterface);

module.exports = NoticeMessage;
