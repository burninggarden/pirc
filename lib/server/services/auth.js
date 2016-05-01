var req = require('req');


var
	Service       = req('/lib/server/service'),
	NoticeMessage = req('/lib/server/messages/notice');

class AuthService extends Service {

	sendInitialNoticeToClient(client) {
		var message = new NoticeMessage();

		message.setBody('whatever...');

		client.sendMessage(message);
	}

}

module.exports = AuthService;
