/*
3.1.7 Quit

      Command: QUIT
   Parameters: [ <Quit Message> ]

   A client session is terminated with a quit message.  The server
   acknowledges this by sending an ERROR message to the client.

   Numeric Replies:

           None.

   Example:

   QUIT :Gone to have lunch        ; Preferred message format.

   :syrk!kalt@millennium.stealth.net QUIT :Gone to have lunch ; User
                                   syrk has quit IRC to have lunch.
*/


function QUIT(test) {
	test.expect(3);

	var client = test.createServerAndClient({
		nickname: 'cloudbreaker',
		username: 'cloudbreaker'
	});

	client.once('registered', function handler(connection) {
		client.quit('some message', function handler() {
			test.equals(connection.isConnected(), false);
			test.done();
		});

		client.awaitCommand('QUIT', function handler(message) {
			test.equals(message.getText(), 'some message');

			client.awaitCommand('ERROR', function handler(message) {
				test.ok(true, 'We are here');
			});
		});
	});
}

module.exports = {
	QUIT
};
