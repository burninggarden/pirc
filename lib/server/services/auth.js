
var
	DNS = require('dns');

var
	extend = req('/utilities/extend'),
	has    = req('/utilities/has');

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
				client.getUserDetails().setHostname(client.getIP());
				this.sendHostnameLookupFailureNoticeToClient(client, error);
			} else {
				client.getUserDetails().setHostname(hostname);
				this.sendHostnameLookupSuccessNoticeToClient(client);
			}
		}

		this.lookupHostnameForClient(client, handler.bind(this));
	}

	lookupHostnameForClient(client, callback) {
		var ip = client.getIP();

		DNS.reverse(ip, function handler(error, hostnames) {
			if (error) {
				return void callback(error);
			}

			if (!hostnames.length) {
				let error = new Error('No matching hostnames found');

				return void callback(error);
			}

			var hostname = hostnames[0];

			DNS.resolve(hostname, function handler(error, addresses) {
				if (error) {
					return void callback(error);
				}

				if (!addresses.length) {
					let error = new Error('No matching DNS records found');

					return void callback(error);
				}

				if (!has(addresses, ip)) {
					let error = new Error('Your IP and hostname don\'t match');

					return void callback(error);
				}

				return void callback(null, hostname);
			});
		});
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
			ip_address   = client.getIP();


		message.addTarget(this.getServiceDetails());
		message.setBody(`*** Could not resolve your hostname: ${error_string}; using your IP address (${ip_address}) instead.`);

		client.sendMessage(message);
	}

	sendHostnameLookupSuccessNoticeToClient(client) {
		var
			message  = new NoticeMessage(),
			hostname = client.getUserDetails().getHostname();

		message.addTarget(this.getServiceDetails());
		message.setBody(`*** Found your hostname (${hostname})`);

		client.sendMessage(message);
	}

}

extend(AuthService.prototype, {
	name: 'Auth',
	type: ServiceTypes.AUTH
});

module.exports = AuthService;
