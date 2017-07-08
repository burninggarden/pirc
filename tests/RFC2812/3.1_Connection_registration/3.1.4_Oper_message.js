/*
3.1.4 Oper message

      Command: OPER
   Parameters: <name> <password>

   A normal user uses the OPER command to obtain operator privileges.
   The combination of <name> and <password> are REQUIRED to gain
   Operator privileges.  Upon success, the user will receive a MODE
   message (see section 3.1.5) indicating the new user modes.

   Numeric Replies:

           ERR_NEEDMOREPARAMS              RPL_YOUREOPER
           ERR_NOOPERHOST                  ERR_PASSWDMISMATCH

   Example:

   OPER foo bar                    ; Attempt to register as an operator
                                   using a username of "foo" and "bar"
                                   as the password.
*/

var
	Replies = req('/lib/constants/replies');

function ERR_NEEDMOREPARAMS(test) {
	test.bypass();
}

function ERR_NOOPERHOST(test) {
	test.bypass();
}

function RPL_YOUREOPER(test) {
	test.expect(4);

	var client = test.createServerAndClient({
		authenticateOperator(parameters, callback) {
			test.equals(parameters.username, 'charizard');
			test.equals(parameters.password, 'blastoise');

			callback(null);
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
			test.done();
		});

		client.awaitReply(Replies.RPL_YOUREOPER, function handler(reply) {
			test.equals(reply.getReply(), Replies.RPL_YOUREOPER);
		});
	});
}

function ERR_PASSWDMISMATCH(test) {
	test.bypass();
}

module.exports = {
	ERR_NEEDMOREPARAMS,
	ERR_NOOPERHOST,
	RPL_YOUREOPER,
	ERR_PASSWDMISMATCH
};
