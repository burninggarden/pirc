
var
	extend = req('/utilities/extend');

var
	Service       = req('/lib/server/service'),
	NoticeMessage = req('/lib/server/messages/notice'),
	ServiceTypes  = req('/constants/service-types');

class AuthService extends Service {

	coupleToClient(client) {
		// noop for now
	}

	decoupleFromClient(client) {
		// noop for now
	}

	registerClient(client, callback) {
		this.sendHostnameLookupNoticeToClient(client);

		function handler(error, hostname) {
			if (error) {
				this.sendHostnameLookupFailureNoticeToClient(client, error);
				this.registerClientViaUserDetails(client, callback);
			} else {
				throw new Error('implement');
			}
		}

		this.lookupHostnameForClient(client, handler.bind(this));
	}

	registerClientViaUserDetails(client, callback) {
	}

	lookupHostnameForClient(client, callback) {
		function deferred() {
			return void callback({
				getMessage() {
					return 'Request timed out';
				}
			});
		}

		setTimeout(deferred.bind(this), 7000);
	}

	handleHostnameLookupSuccess() {
		throw new Error('implement');
	}

	sendHostnameLookupNoticeToClient(client) {
		var message = new NoticeMessage();

		message.addTarget(this.getServiceDetails());
		message.setBody('*** Looking up your hostname...');

		client.sendMessage(message);
	}

	sendHostnameLookupFailureNoticeToClient(client, error) {
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
	name: 'Auth',
	type: ServiceTypes.AUTH
});

module.exports = AuthService;
