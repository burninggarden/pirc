/*
4.4 Restart message

      Command: RESTART
   Parameters: None

   An operator can use the restart command to force the server to
   restart itself.  This message is optional since it may be viewed as a
   risk to allow arbitrary people to connect to a server as an operator
   and execute this command, causing (at least) a disruption to service.

   The RESTART command MUST always be fully processed by the server to
   which the sending client is connected and MUST NOT be passed onto
   other connected servers.

   Numeric Replies:

           ERR_NOPRIVILEGES

   Example:

   RESTART                         ; no parameters required.

*/


function restart(test) {
	test.expect(5);

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

			client.sendRestartMessage(function handler(error) {
				test.equals(error, null);
				test.done();
			});

			client.awaitNotice(function handler(notice) {
				test.equals(notice.getMessageBody(), 'Server restarting.');
			});
		});
	});
}

function ERR_NOPRIVILEGES(test) {
	test.expect(2);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler() {

		client.sendRestartMessage(function handler(error) {
			test.ok(error !== null);
		});

		client.awaitReply('ERR_NOPRIVILEGES', function handler(reply) {
			test.equals(reply.getReply(), 'ERR_NOPRIVILEGES');
			test.done();
		});
	});
}

module.exports = {
	restart,
	ERR_NOPRIVILEGES
};
