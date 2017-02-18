
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

		this.lookupHostnameForClient(client);
	}

	lookupHostnameForClient(client) {
		function deferred() {
			var error = {
				getMessage() {
					return 'Request timed out';
				}
			};

			this.handleHostnameLookupFailure(client, error);
		}

		setTimeout(deferred.bind(this), 7000);
	}

	handleHostnameLookupSuccess() {
		throw new Error('implement');
	}

	handleHostnameLookupFailure(client, error) {
		var
			message      = new NoticeMessage(),
			error_string = error.getMessage(),
			ip_address   = '127.0.0.1';


		message.addTarget(this.getServiceDetails());
		message.setBody(`*** Could not resolve your hostname: ${error_string}; using your IP address (${ip_address}) instead.`);

		client.sendMessage(message);
	}

}

extend(AuthService.prototype, {
	name: 'Auth'
});

module.exports = AuthService;
