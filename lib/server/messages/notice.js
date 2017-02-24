
var
	extendClass            = req('/utilities/extend-class'),
	ServerMessage          = req('/lib/server/message'),
	NoticeMessageInterface = req('/lib/interfaces/messages/notice');


class ServerNoticeMessage extends ServerMessage {

}

extendClass(ServerNoticeMessage).withInterface(NoticeMessageInterface);

module.exports = ServerNoticeMessage;
