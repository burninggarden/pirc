
var
	extend = req('/utilities/extend');

var
	Service       = req('/lib/server/service'),
	NoticeMessage = req('/lib/server/messages/notice');

class AuthService extends Service {

	registerClient(client) {
		// noop for now
	}

	unregisterClient(client) {
		// noop for now
	}

	handleClientConnection(client) {
		var message = new NoticeMessage();

		message.addTarget(this.getServiceDetails());
		message.setBody('*** Looking up your hostname...');

		client.sendMessage(message);
	}

}

extend(AuthService.prototype, {
	name: 'Auth'
});

module.exports = AuthService;
