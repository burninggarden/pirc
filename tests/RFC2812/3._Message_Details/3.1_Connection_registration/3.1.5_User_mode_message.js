/*
3.1.5 User mode message

      Command: MODE
   Parameters: <nickname>
               *( ( "+" / "-" ) *( "i" / "w" / "o" / "O" / "r" ) )

   The user MODE's are typically changes which affect either how the
   client is seen by others or what 'extra' messages the client is sent.

   A user MODE command MUST only be accepted if both the sender of the
   message and the nickname given as a parameter are both the same.  If
   no other parameter is given, then the server will return the current
   settings for the nick.

      The available modes are as follows:

           a - user is flagged as away;
           i - marks a users as invisible;
           w - user receives wallops;
           r - restricted user connection;
           o - operator flag;
           O - local operator flag;
           s - marks a user for receipt of server notices.

   Additional modes may be available later on.

   The flag 'a' SHALL NOT be toggled by the user using the MODE command,
   instead use of the AWAY command is REQUIRED.

   If a user attempts to make themselves an operator using the "+o" or
   "+O" flag, the attempt SHOULD be ignored as users could bypass the
   authentication mechanisms of the OPER command.  There is no
   restriction, however, on anyone `deopping' themselves (using "-o" or
   "-O").

   On the other hand, if a user attempts to make themselves unrestricted
   using the "-r" flag, the attempt SHOULD be ignored.  There is no
   restriction, however, on anyone `deopping' themselves (using "+r").
   This flag is typically set by the server upon connection for
   administrative reasons.  While the restrictions imposed are left up
   to the implementation, it is typical that a restricted user not be
   allowed to change nicknames, nor make use of the channel operator
   status on channels.

   The flag 's' is obsolete but MAY still be used.

   Numeric Replies:

           ERR_NEEDMOREPARAMS              ERR_USERSDONTMATCH
           ERR_UMODEUNKNOWNFLAG            RPL_UMODEIS

   Examples:

   MODE WiZ -w                     ; Command by WiZ to turn off
                                   reception of WALLOPS messages.

   MODE Angel +i                   ; Command from Angel to make herself
                                   invisible.

   MODE WiZ -o                     ; WiZ 'deopping' (removing operator
                                   status).
*/


function ERR_NEEDMOREPARAMS(test) {
	test.expect(1);
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.sendRawMessage('MODE');

		function handler(reply) {
			test.equals(reply.getAttemptedCommand(), 'MODE');
			test.done();
		}

		client.awaitReply('ERR_NEEDMOREPARAMS', handler);
	});
}

function ERR_UMODEUNKNOWNFLAG(test) {
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.sendRawMessage('MODE cloudbreaker +y');

		function handler(reply) {
			test.equals(reply.getReply(), 'ERR_UMODEUNKNOWNFLAG');
			test.done();
		}

		client.awaitReply('ERR_UMODEUNKNOWNFLAG', handler);
	});
}

function ERR_USERSDONTMATCH(test) {
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.sendRawMessage('MODE domino +r');

		function handler(reply) {
			test.equals(reply.getReply(), 'ERR_USERSDONTMATCH');
			test.done();
		}

		client.awaitReply('ERR_USERSDONTMATCH', handler);
	});
}

function RPL_UMODEIS(test) {
	test.expect(2);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.addUserMode('r', function handler(error) {
			test.equals(error, null);

			client.sendRawMessage('MODE cloudbreaker');

			client.awaitReply('RPL_UMODEIS', function handler(reply) {
				test.deepEqual(reply.getUserModes(), [
					'r'
				]);
				test.done();
			});
		});
	});
}

function addAwayFlag(test) {
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.sendRawMessage('MODE cloudbreaker +a');

		function handler(reply) {
			test.equals(reply.getReply(), 'ERR_UMODEUNKNOWNFLAG');
			test.done();
		}

		client.awaitReply('ERR_UMODEUNKNOWNFLAG', handler);
	});
}

function removeAwayFlag(test) {
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.sendRawMessage('MODE cloudbreaker -a');

		function handler(reply) {
			test.equals(reply.getReply(), 'ERR_UMODEUNKNOWNFLAG');
			test.done();
		}

		client.awaitReply('ERR_UMODEUNKNOWNFLAG', handler);
	});
}

function addOperatorFlag(test) {
	test.expect(1);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler() {
		client.getMotd(function handler() {
			client.sendRawMessage('MODE cloudbreaker +o');

			var timer = setTimeout(function deferred() {
				test.ok(true, 'No messages received');
				test.done();
			}, 2000);

			client.on('raw_message', function handler(message) {
				clearTimeout(timer);

				test.ok(
					false,
					'Unexpected message: ' + message.getRawMessage()
				);

				test.done();
			});
		});
	});
}

function removeOperatorFlag(test) {
	test.expect(8);

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

			client.awaitCommand('MODE', function handler(command) {
				var user_details = client.getUserDetails();

				test.ok(user_details.hasMode('o'));
				test.ok(user_details.hasMode('O'));

				client.removeUserMode('o', function handler(error) {
					test.equals(error, null);

					test.ok(!user_details.hasMode('o'));
					test.done();
				});
			});
		});

		client.awaitReply('RPL_YOUREOPER', function handler(reply) {
			test.equals(reply.getReply(), 'RPL_YOUREOPER');
		});
	});
}

function addRestrictedFlag(test) {
	test.expect(2);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler() {
		client.addUserMode('r', function handler(error) {
			test.equals(error, null);
			test.ok(client.getUserDetails().isRestricted());
			test.done();
		});
	});
}

function removeRestrictedFlag(test) {
	test.expect(2);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler() {
		client.getMotd(function handler() {
			client.addUserMode('r', function handler(error) {
				test.equals(error, null);

				client.sendRawMessage('MODE cloudbreaker -r');

				var timer = setTimeout(function deferred() {
					test.ok(true, 'No messages received');
					test.done();
				}, 2000);

				client.on('raw_message', function handler(message) {
					clearTimeout(timer);
					test.ok(false, 'Unexpected message: ' + message.getRawMessage());
					test.done();
				});
			});
		});
	});
}


module.exports = {
	ERR_NEEDMOREPARAMS,
	ERR_UMODEUNKNOWNFLAG,
	ERR_USERSDONTMATCH,
	RPL_UMODEIS,
	addAwayFlag,
	removeAwayFlag,
	addOperatorFlag,
	removeOperatorFlag,
	addRestrictedFlag,
	removeRestrictedFlag
};
