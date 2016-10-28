var
	Server = req('/lib/server'),
	Client = req('/lib/client');

function ensureSenderDoesNotReceiveOwnMessage(test) {
	test.expect(0);

	var server = new Server({
		hostname: 'irc.burninggarden.com'
	});

	server.listen(1234);

	var client = new Client();

	client.connectToServer({
		address: '127.0.0.1',
		port:    1234,
		nick:    'morrigan'
	}, function handler() {
		client.joinChannel('#ganondorf', function handler(error, channel) {
			channel.on('message', function handler(message) {
				test.ok(
					false,
					'Sender should not receive messages from herself'
				);
			});

			client.sendMessageToChannel('foobar', channel);

			setTimeout(function finisher() {
				client.destroy();
				server.destroy();

				test.done();
			}, 256);
		});
	});

}

module.exports = {
	ensureSenderDoesNotReceiveOwnMessage
};
