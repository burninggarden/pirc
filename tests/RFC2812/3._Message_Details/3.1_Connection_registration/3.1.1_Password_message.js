
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
	Enum_Replies  = req('/lib/enum/replies'),
	Enum_Commands = req('/lib/enum/commands');

function ERR_NEEDMOREPARAMS(test) {
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

		function handler(reply) {
			test.equals(reply.getAttemptedCommand(), Enum_Commands.PASS);
			test.done();
		}

		client.awaitReply(Enum_Replies.ERR_NEEDMOREPARAMS, handler);
	});
}

function ERR_ALREADYREGISTRED(test) {
	test.expect(1);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler() {
		client.sendRawMessage('PASS whatever');

		function handler(reply) {
			test.ok(true, 'Received ERR_ALREADYREGISTRED reply');
			test.done();
		}

		client.awaitReply(Enum_Replies.ERR_ALREADYREGISTRED, handler);
	});
}

module.exports = {
	ERR_NEEDMOREPARAMS,
	ERR_ALREADYREGISTRED
};
