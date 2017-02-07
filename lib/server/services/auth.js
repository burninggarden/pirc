var req = require('req');


var
	Service       = req('/lib/server/service'),
	NoticeMessage = req('/lib/server/messages/notice');

class AuthService extends Service {

	registerClient(client) {
		this.sendInitialNoticeToClient(client);
	}

	unregisterClient(client) {
		// noop for now
	}

	sendInitialNoticeToClient(client) {
		var message = new NoticeMessage();

		message.addTarget(client.getUserDetails());
		message.setBody('whatever...');

		client.sendMessage(message);
	}

}

module.exports = AuthService;
