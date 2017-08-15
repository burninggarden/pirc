/*

3.1.2 Nick message

      Command: NICK
   Parameters: <nickname> [ <hopcount> ]

   NICK message is used to give user a nickname or change the previous
   one.  The <hopcount> parameter is only used by servers to indicate
   how far away a nick is from its home server.  A local connection has
   a hopcount of 0.  If supplied by a client, it must be ignored.

   If a NICK message arrives at a server which already knows about an
   identical nickname for another client, a nickname collision occurs.
   As a result of a nickname collision, all instances of the nickname
   are removed from the server's database, and a KILL command is issued
   to remove the nickname from all other server's database. If the NICK
   message causing the collision was a nickname change, then the
   original (old) nick must be removed as well.

   If the server recieves an identical NICK from a client which is
   directly connected, it may issue an ERR_NICKCOLLISION to the local
   client, drop the NICK command, and not generate any kills.

   Numeric Replies:

           ERR_NONICKNAMEGIVEN             ERR_ERRONEUSNICKNAME
           ERR_NICKNAMEINUSE               ERR_NICKCOLLISION
           ERR_UNAVAILRESOURCE             ERR_RESTRICTED

   Examples:

   NICK Wiz                ; Introducing new nick "Wiz" if session is
                           still unregistered, or user changing his
                           nickname to "Wiz"

   :WiZ!jto@tolsun.oulu.fi NICK Kilroy
                           ; Server telling that WiZ changed his
                           nickname to Kilroy.
*/


var
	Replies   = req('/lib/constants/replies'),
	UserModes = req('/lib/constants/user-modes');


function NICK(test) {
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.changeNickname('domino', function handler(error) {
			test.equals(error, null);
			test.equals(connection.getNickname(), 'domino');
			test.done();
		});
	});
}

function ERR_NONICKNAMEGIVEN(test) {
	test.expect(1);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.sendRawMessage('NICK');

		client.awaitReply(Replies.ERR_NONICKNAMEGIVEN, function handler(reply) {
			test.equals(reply.getReply(), Replies.ERR_NONICKNAMEGIVEN);
			test.done();
		});
	});
}

function ERR_NICKNAMEINUSE(test) {
	test.expect(1);

	var server = test.createServer();

	var first_client = test.createClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker',
		port:     server.getPort()
	});

	first_client.once('registered', function handler(connection) {
		var second_client = test.createClient({
			nickname: 'cloudbreaker',
			username: 'clone',
			port:     server.getPort()
		});

		second_client.awaitReply(Replies.ERR_NICKNAMEINUSE, function handler(reply) {
			test.equals(reply.getNickname(), 'cloudbreaker');
			test.done();
		});
	});
}

function ERR_ERRONEUSNICKNAME(test) {
	test.expect(1);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.sendRawMessage('NICK πππ');

		client.awaitReply(Replies.ERR_ERRONEUSNICKNAME, function handler(reply) {
			test.equals(reply.getNickname(), 'πππ');
			test.done();
		});
	});
}

function ERR_NICKCOLLISION(test) {
	test.bypass();
}

function ERR_RESTRICTED(test) {
	test.expect(5);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.addUserMode(UserModes.RESTRICTED, function handler(error) {
			test.equals(error, null);
			test.ok(connection.isRestricted());

			client.changeNickname('bowser', function handler(error) {
				test.ok(error !== null);
				test.equals(connection.getNickname(), 'cloudbreaker');

				test.done();
			});
		});

		client.awaitReply(Replies.ERR_RESTRICTED, function handler(reply) {
			test.ok(reply.getReply() === Replies.ERR_RESTRICTED);
		});
	});
}

function ERR_UNAVAILRESOURCE(test) {
	test.bypass();
}

module.exports = {
	NICK,
	ERR_NONICKNAMEGIVEN,
	ERR_NICKNAMEINUSE,
	ERR_ERRONEUSNICKNAME,
	ERR_NICKCOLLISION,
	ERR_RESTRICTED,
	ERR_UNAVAILRESOURCE
};
