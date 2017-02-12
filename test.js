

function handleError(error) {
	console.error(error);
	process.exit(1);
}


var Pirc = require('./index');

var server = new Pirc.Server({
	hostname: 'irc.burninggarden.com',
	motd:     'Sample MOTD'
});

server.listen(6667);

var client = new Pirc.Client();

client.connectToServer({
	hostname: '127.0.0.1',
	port:     6667,
	nick:     'morrigan'
}, function handler(error) {
	if (error) {
		return void handleError(error);
	}

	client.joinChannel('#ganondorf', function handler(error, channel) {
		if (error) {
			return void handleError(error);
		}

		setTimeout(function deferred() {
			client.sendMessageToChannel('foo', channel);
		}, 2000);
	});
});

var client2 = new Pirc.Client();

client2.connectToServer({
	hostname: '127.0.0.1',
	port:     6667,
	nick:     'lilith'
}, function handler(error) {
	if (error) {
		return void handleError(error);
	}

	client2.joinChannel('#ganondorf', function handler(error, channel) {
		if (error) {
			return void handleError(error);
		}
	});

	client2.on('message', function handler(message) {
		if (!message.hasNick()) {
			return;
		}

		var nick = message.getNick();

		client2.sendWhoisQueryForNick(nick, function handler(error, user) {
			if (error) {
				return void handleError(error);
			}

			console.log(user.getRealname());
			console.log(user.getChannelNames());

			process.exit(0);
		});
	});
});

var regexes = require('./constants/regexes');
console.log(regexes.NICK);
