
/*
3.1.1 Password message

      Command: PASS
   Parameters: <password>

   The PASS command is used to set a 'connection password'.  The
   optional password can and MUST be set before any attempt to register
   the connection is made.  Currently this requires that user send a
   PASS command before sending the NICK/USER combination.

   Numeric Replies:

           ERR_NEEDMOREPARAMS              ERR_ALREADYREGISTRED

   Example:

           PASS secretpasswordhere
*/

var
	Replies  = req('/lib/constants/replies'),
	Commands = req('/lib/constants/commands');

function testNeedMoreParams(test) {
	test.expect(1);

	var client = test.createServerAndClient({
		nickname:     'cloudbreaker',
		username:     'cloudbreaker',
		autoregister: false
	});

	client.once('connected', function handler() {
		client.sendRawMessage('PASS');
		client.sendRawMessage('NICK balrog');
		client.sendRawMessage('USER balrog 0 * :balrog');

		client.awaitReply(Replies.ERR_NEEDMOREPARAMS, function handler(reply) {
			test.equals(reply.getAttemptedCommand(), Commands.PASS);
			test.done();
		});
	});
}

function testAlreadyRegistered(test) {
	test.expect(1);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler() {
		client.sendRawMessage('PASS whatever');

		client.awaitReply(Replies.ERR_ALREADYREGISTRED, function handler(reply) {
			test.ok(true, 'Received ERR_ALREADYREGISTRED reply');
			test.done();
		});
	});
}

module.exports = {
	testNeedMoreParams,
	testAlreadyRegistered
};
