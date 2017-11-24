/*
3.1.3 User message

      Command: USER
   Parameters: <user> <mode> <unused> <realname>

   The USER command is used at the beginning of connection to specify
   the username, hostname and realname of a new user.

   The <mode> parameter should be a numeric, and can be used to
   automatically set user modes when registering with the server.  This
   parameter is a bitmask, with only 2 bits having any signification: if
   the bit 2 is set, the user mode 'w' will be set and if the bit 3 is
   set, the user mode 'i' will be set.  (See Section 3.1.5 "User
   Modes").

   The <realname> may contain space characters.

   Numeric Replies:

           ERR_NEEDMOREPARAMS              ERR_ALREADYREGISTRED

   Example:

   USER guest 0 * :Ronnie Reagan   ; User registering themselves with a
                                   username of "guest" and real name
                                   "Ronnie Reagan".

   USER guest 8 * :Ronnie Reagan   ; User registering themselves with a
                                   username of "guest" and real name
                                   "Ronnie Reagan", and asking to be set
                                   invisible.
*/

var
	Enum_Replies  = req('/lib/enum/replies'),
	Enum_Commands = req('/lib/enum/commands');

function ERR_NEEDMOREPARAMS(test) {
	var client = test.createServerAndClient({
		nickname:     'cloudbreaker',
		username:     'cloudbreaker',
		autoregister: false
	});

	client.once('connected', function handler() {
		client.sendRawMessage('NICK balrog');
		client.sendRawMessage('USER balrog');

		function handler(reply) {
			test.equals(reply.getAttemptedCommand(), Enum_Commands.USER);
			test.done();
		}

		client.awaitReply(Enum_Replies.ERR_NEEDMOREPARAMS, handler);
	});
}

function ERR_ALREADYREGISTRED(test) {
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker',
	});

	client.once('registered', function handler() {
		client.sendRawMessage('USER balrog 0 * :balrog');

		function handler(reply) {
			test.done();
		}

		client.awaitReply(Enum_Replies.ERR_ALREADYREGISTRED, handler);
	});
}

module.exports = {
	ERR_NEEDMOREPARAMS,
	ERR_ALREADYREGISTRED
};
