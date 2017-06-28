
var
	DNS = require('dns');

var
	extend = req('/lib/utilities/extend'),
	has    = req('/lib/utilities/has');

var
	Module        = req('/lib/server/module'),
	NoticeMessage = req('/lib/messages/commands/notice'),
	ModuleTypes   = req('/lib/constants/module-types'),
	BaseError     = req('/lib/errors/base');


class AuthModule extends Module {

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

			callback(null);
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

		message.setMessageBody('*** Looking up your hostname...');
		message.setMessageTarget('*');
		client.sendMessage(message);
	}

	sendHostnameLookupFailureNoticeToClient(client, error) {
		var
			message    = new NoticeMessage(),
			ip_address = client.getIP(),
			error_string;

		if (error instanceof BaseError) {
			error_string = error.getBody();
		} else {
			error_string = error.toString().replace('Error: ', '');
		}

		message.setMessageBody(
			`*** Could not resolve your hostname: ${error_string}; using your IP address (${ip_address}) instead.`
		);

		message.setMessageTarget('*');
		client.sendMessage(message);
	}

	sendHostnameLookupSuccessNoticeToClient(client) {
		var
			message  = new NoticeMessage(),
			hostname = client.getUserDetails().getHostname();

		message.setMessageBody(`*** Found your hostname (${hostname})`);

		message.setMessageTarget('*');
		client.sendMessage(message);
	}

}

extend(AuthModule.prototype, {
	name: 'Auth',
	type: ModuleTypes.AUTH
});

module.exports = AuthModule;
