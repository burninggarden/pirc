var Pirc = require('./index');

var server = new Pirc.Server({
	hostname: 'irc.burninggarden.com'
});

server.listen(6667);

/*
var client = new Pirc.Client();

client.connectToServer({
	hostname: '127.0.0.1',
	port:     6667,
	nick:     'morrigan'
}, function handler(error) {
	if (error) {
		console.error(error);
		process.exit(1);
	}

	client.joinChannel('#ganondorf', function handler(error, channel) {
		channel.on('message', function handler(message) {
		});

		setInterval(function() {
			client.sendMessageToChannel(Math.random().toString(16).slice(3), '#ganondorf');
		}, 1000);
	});
});

var client2 = new Pirc.Client();

client2.connectToServer({
	hostname: '127.0.0.1',
	port:     6667,
	nick:     'lilith'
}, function handler() {
	client2.joinChannel('#ganondorf', function handler(error, channel) {
		if (error) {
			throw error;
		}

		channel.on('message', function handler(message) {
			console.log('CAUGHT A MESSAGE!');
			console.log(message.body);
		});
	});
});
*/
