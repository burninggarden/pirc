
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
	var client = test.createServerAndClient({
		nickname:              'cloudbreaker',
		username:              'cloudbreaker',
		autoregister:          false,
		log_outbound_messages: true
	});

	client.once('connected', function handler() {
		client.sendRawMessage('PASS');

		client.awaitReply(Replies.ERR_NEEDMOREPARAMS, function handler(reply) {
			test.equals(reply.getCommand(), Commands.PASS);
			test.done();
		});
	});
}

function testAlreadyRegistered(test) {
	test.done();
}

module.exports = {
	testNeedMoreParams,
	testAlreadyRegistered
};
