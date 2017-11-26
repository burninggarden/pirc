/*
4.1 Away

      Command: AWAY
   Parameters: [ <text> ]

   With the AWAY command, clients can set an automatic reply string for
   any PRIVMSG commands directed at them (not to a channel they are on).
   The server sends an automatic reply to the client sending the PRIVMSG
   command.  The only replying server is the one to which the sending
   client is connected to.

   The AWAY command is used either with one parameter, to set an AWAY
   message, or with no parameters, to remove the AWAY message.

   Because of its high cost (memory and bandwidth wise), the AWAY
   message SHOULD only be used for client-server communication.  A
   server MAY choose to silently ignore AWAY messages received from
   other servers.  To update the away status of a client across servers,
   the user mode 'a' SHOULD be used instead.  (See Section 3.1.5)

   Numeric Replies:

           RPL_UNAWAY                    RPL_NOWAWAY


   Example:

   AWAY :Gone to lunch.  Back in 5 ; Command to set away message to
                                   "Gone to lunch.  Back in 5".

*/


function RPL_NOWAWAY(test) {
	test.expect(4);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.setAwayMessage('En taro adun', function handler(error) {
			test.equals(error, null);
			test.equals(client.isAway(), true);
			test.equals(client.getAwayMessage(), 'En taro adun');
		});

		client.awaitReply('RPL_NOWAWAY', function handler(reply) {
			test.ok(reply.getReply() === 'RPL_NOWAWAY');
			test.done();
		});
	});
}

function RPL_UNAWAY(test) {
	test.expect(6);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.setAwayMessage('En taro adun', function handler(error) {
			test.equals(error, null);
			test.equals(client.isAway(), true);

			client.awaitReply('RPL_UNAWAY', function handler(reply) {
				test.ok(reply.getReply() === 'RPL_UNAWAY');
				test.done();
			});

			client.removeAwayMessage(function handler(error) {
				test.equals(error, null);
				test.equals(client.isAway(), false);
				test.equals(client.getAwayMessage(), null);
			});
		});
	});
}

function acrossServers(test) {
	test.bypass();
}

module.exports = {
	RPL_NOWAWAY,
	RPL_UNAWAY,
	acrossServers
};
