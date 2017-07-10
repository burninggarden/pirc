

var
	Commands = req('/lib/constants/commands');


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

		client.awaitCommand(Commands.QUIT, function handler(message) {
			test.equals(message.getText(), 'some message');

			client.awaitCommand(Commands.ERROR, function handler(message) {
				test.ok(true, 'We are here');
			});
		});
	});
}

module.exports = {
	QUIT
};
