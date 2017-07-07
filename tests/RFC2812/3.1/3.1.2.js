/*

3.1.2 Nick message


      Command: NICK
   Parameters: <nickname>

   NICK command is used to give user a nickname or change the existing
   one.

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
	Replies = req('/lib/constants/replies');


function nickChange(test) {
	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.setNickname('domino', function handler(error) {
			test.equals(error, null);
			test.equals(connection.getUserDetails().getNickname(), 'domino');
			test.done();
		});
	});
}

function noNicknameGiven(test) {
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

function nicknameInUse(test) {
	test.done();
}

function erroneousNickname(test) {
	test.done();
}

function nickCollision(test) {
	test.done();
}

function restricted(test) {
	test.done();
}

function unavailableResource(test) {
	test.done();
}

module.exports = {
	nickChange,
	noNicknameGiven,
	nicknameInUse,
	erroneousNickname,
	nickCollision,
	restricted,
	unavailableResource
};
