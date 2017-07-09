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

var
	Replies   = req('/lib/constants/replies'),
	Commands  = req('/lib/constants/commands'),
	UserModes = req('/lib/constants/user-modes');


function ERR_NEEDMOREPARAMS(test) {
	test.expect(1);
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.sendRawMessage('MODE');

		client.awaitReply(Replies.ERR_NEEDMOREPARAMS, function handler(reply) {
			test.equals(reply.getAttemptedCommand(), Commands.MODE);
			test.done();
		});
	});
}

function ERR_UMODEUNKNOWNFLAG(test) {
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.sendRawMessage('MODE cloudbreaker +y');

		client.awaitReply(Replies.ERR_UMODEUNKNOWNFLAG, function handler(reply) {
			test.equals(reply.getReply(), Replies.ERR_UMODEUNKNOWNFLAG);
			test.done();
		});
	});
}

function ERR_USERSDONTMATCH(test) {
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.sendRawMessage('MODE domino +r');

		client.awaitReply(Replies.ERR_USERSDONTMATCH, function handler(reply) {
			test.equals(reply.getReply(), Replies.ERR_USERSDONTMATCH);
			test.done();
		});
	});
}

function RPL_UMODEIS(test) {
	test.expect(2);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.addUserMode(UserModes.RESTRICTED, function handler(error) {
			test.equals(error, null);
			client.sendRawMessage('MODE cloudbreaker');

			client.awaitReply(Replies.RPL_UMODEIS, function handler(reply) {
				test.deepEqual(reply.getUserModes(), [
					'r'
				]);
				test.done();
			});
		});
	});
}

function addAwayFlag(test) {
	test.bypass();
}

function removeAwayFlag(test) {
	test.bypass();
}

function addOperatorFlag(test) {
	test.bypass();
}

function removeOperatorFlag(test) {
	test.bypass();
}

function addRestrictedFlag(test) {
	test.bypass();
}

function removeRestrictedFlag(test) {
	test.bypass();
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
