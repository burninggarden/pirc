var Pirc = require('./index');

/*
var log = console.log;

console.log = function line() {
	var stack;

	try {
		throw new Error('abstracted');
	} catch (error) {
		stack = error.stack;
		log.apply(console, Array.prototype.slice.call(arguments));
		log.call(console, stack.split('\n')[2]);
	}
};
*/

var server = new Pirc.Server({
	hostname: 'irc.burninggarden.com'
});

server.listen(1234);

server.on('error', function handler(error) {
	console.error(error);
});

var client = new Pirc.Client();

client.connectToServer({
	address: '127.0.0.1',
	port:    1234,
	nick:    'morrigan'
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

