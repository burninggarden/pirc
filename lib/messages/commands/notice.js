
var
	extendClass            = req('/lib/utilities/extend-class'),
	ClientMessage          = req('/lib/client/message'),
	NoticeMessageInterface = req('/lib/interfaces/messages/notice');


class ClientNoticeMessage extends ClientMessage {

}

extendClass(ClientNoticeMessage).withInterface(NoticeMessageInterface);

module.exports = ClientNoticeMessage;
