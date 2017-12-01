/*
3.4.7 Connect message

      Command: CONNECT
   Parameters: <target server> <port> [ <remote server> ]

   The CONNECT command can be used to request a server to try to
   establish a new connection to another server immediately.  CONNECT is
   a privileged command and SHOULD be available only to IRC Operators.
   If a <remote server> is given and its mask doesn't match name of the
   parsing server, the CONNECT attempt is sent to the first match of
   remote server. Otherwise the CONNECT attempt is made by the server
   processing the request.

   The server receiving a remote CONNECT command SHOULD generate a
   WALLOPS message describing the source and target of the request.

   Numeric Replies:

           ERR_NOSUCHSERVER              ERR_NOPRIVILEGES
           ERR_NEEDMOREPARAMS


   Examples:

   CONNECT tolsun.oulu.fi 6667     ; Command to attempt to connect local
                                   server to tolsun.oulu.fi on port 6667

*/

function ERR_NOSUCHSERVER(test) {
	var client = test.createServerAndClient({
		authenticateOperator(parameters, callback) {
			test.equals(parameters.username, 'charizard');
			test.equals(parameters.password, 'blastoise');

			callback(null, ['o', 'O']);
		}
	}, {
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler() {
		var
			username = 'charizard',
			password = 'blastoise';

		client.registerAsOperator(username, password, function handler(error) {
			test.equals(error, null);

			var
				key      = Math.random().toString(16).slice(3),
				hostname = `gadgetzan.t${key}.net`,
				port     = 6667;

			client.awaitReply('ERR_NOSUCHSERVER', function handler(reply) {
				test.equals(reply.getReply(), 'ERR_NOSUCHSERVER');
				test.equals(reply.getHostname(), hostname);
			});

			client.sendConnectMessage(hostname, port, function handler(error) {
				test.ok(error !== null);
				test.done();
			});
		});
	});
}

function ERR_NOPRIVILEGES(test) {
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler() {
		var
			hostname = 'gadgetzan.tanaris.net',
			port     = 6667;

		client.sendConnectMessage(hostname, port, function handler(error) {
			test.ok(error !== null);
		});

		client.awaitReply('ERR_NOPRIVILEGES', function handler(reply) {
			test.equals(reply.getReply(), 'ERR_NOPRIVILEGES');
			test.done();
		});
	});
}

function ERR_NEEDMOREPARAMS(test) {
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler() {
		client.sendRawMessage('CONNECT foo');

		client.awaitReply('ERR_NEEDMOREPARAMS', function handler(reply) {
			test.equals(reply.getReply(), 'ERR_NEEDMOREPARAMS');
			test.equals(reply.getAttemptedCommand(), 'CONNECT');
			test.done();
		});
	});
}

function localConnect(test) {
	var hostname = 'localhost';

	var client = test.createServerAndClient({
		password: 'glamdring',

		authenticateServer(parameters, callback) {
			test.equals(parameters.hostname, hostname);
			test.equals(parameters.password, 'glamdring');

			if (
				   parameters.hostname === hostname
				&& parameters.password === 'orcrist'
			) {
				test.clearTimeout();
				return void callback(null);
			} else {
				test.ok(false, 'Credentials mismatch');
				test.done();
			}
		},

		authenticateOperator(parameters, callback) {
			test.equals(parameters.username, 'charizard');
			test.equals(parameters.password, 'blastoise');

			callback(null, ['o', 'O']);
		}
	}, {
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler() {
		var
			username = 'charizard',
			password = 'blastoise';

		client.registerAsOperator(username, password, function handler(error) {
			if (error) {
				test.ok(false, error.toString());
				return void test.done();
			}

			var server = test.createServer({
				password:              'orcrist',
				log_incoming_messages: true,
				log_outgoing_messages: true,

				authenticateServer(parameters, callback) {
					test.equals(parameters.hostname, hostname);
					test.equals(parameters.password, 'glamdring');

					if (
						   parameters.hostname === hostname
						&& parameters.password === 'glamdring'
					) {
						return void callback(null);
					} else {
						test.ok(false, 'Credentials mismatch');
						test.done();
					}
				}
			});

			var port = server.getPort();

			client.sendConnectMessage(hostname, port, function handler(error) {
				test.ok(error !== null);
			});
		});
	});
}

function remoteConnect(test) {
	test.bypass();
}

module.exports = {
	/*
	ERR_NOSUCHSERVER,
	ERR_NOPRIVILEGES,
	ERR_NEEDMOREPARAMS,
	*/
	localConnect,
	remoteConnect
};
