
/*
3.1 Connection Registration

   The commands described here are used to register a connection with an
   IRC server as a user as well as to correctly disconnect.

   A "PASS" command is not required for a client connection to be
   registered, but it MUST precede the latter of the NICK/USER
   combination (for a user connection) or the SERVICE command (for a
   service connection). The RECOMMENDED order for a client to register
   is as follows:

                           1. Pass message
           2. Nick message                 2. Service message
           3. User message

   Upon success, the client will receive an RPL_WELCOME (for users) or
   RPL_YOURESERVICE (for services) message indicating that the
   connection is now registered and known the to the entire IRC network.
   The reply message MUST contain the full client identifier upon which
   it was registered.
*/

function testUserRegistrationWithPassword(test) {
	test.expect(4);

	var client = test.createServerAndClient({
		authenticateUser(parameters, callback) {
			test.equals(parameters.nickname, 'cloudbreaker');
			test.equals(parameters.username, 'cloudbreaker');
			test.equals(parameters.password, 'pikachu');

			callback(null, true);
		}
	}, {
		nickname: 'cloudbreaker',
		username: 'cloudbreaker',
		password: 'pikachu'
	});

	client.awaitReply('RPL_WELCOME', function handler(reply) {
		var user_id = reply.getUserId();

		test.equals(user_id, 'cloudbreaker!~cloudbreaker@127.0.0.1');
		test.done();
	});
}

function testUserRegistrationWithoutPassword(test) {
	test.expect(4);

	var client = test.createServerAndClient({
		authenticateUser(parameters, callback) {
			test.equals(parameters.nickname, 'cloudbreaker');
			test.equals(parameters.username, 'cloudbreaker');
			test.equals(parameters.password, null);

			callback(null, false);
		}
	}, {
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.awaitReply('RPL_WELCOME', function handler(reply) {
		var user_id = reply.getUserId();

		test.equals(user_id, 'cloudbreaker!~cloudbreaker@127.0.0.1');
		test.done();
	});
}

function testServiceRegistrationWithPassword(test) {
	test.bypass();
}

function testServiceRegistrationWithoutPassword(test) {
	test.bypass();
}

module.exports = {
	'User registration with password':       testUserRegistrationWithPassword,
	'User registration without password':    testUserRegistrationWithoutPassword,
	'Service registration with password':    testServiceRegistrationWithPassword,
	'Service registration without password': testServiceRegistrationWithoutPassword
};
