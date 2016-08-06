var Pirc = require('./index');

/*
var server = new Pirc.Server();

server.setName('irc.burninggarden.com');
server.listen(6667);
*/

var client = new Pirc.Client();

client.connectToServer({
	address: 'irc.freenode.org',
	port:    6667,
	nick:    'chabaxbe'
}, function handler(error) {
	if (error) {
		return void console.warn(error);
	}

	client.joinChannel('#ganondorf', function handler(error, channel) {

		channel.on('message', function handler(message) {
			console.log('CAUGHT MESSAGE:');
			console.log('CAUGHT MESSAGE:');
			console.log('CAUGHT MESSAGE:');
			console.log(message);
		});

		client.sendMessageToChannel('foobar', '#ganondorf');
	});

	client.on('disconnect', function handler() {
		console.log('caught a disconnect');
	});
});
