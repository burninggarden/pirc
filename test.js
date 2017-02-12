

function handleError(error) {
	console.error(error);
	process.exit(1);
}


var Pirc = require('./index');

var MarkovConstructor = require('/home/pachet/burninggarden/utility/markov/constructor');

var AlreadyInChannelError = require('./lib/errors/already-in-channel');

function getRandomCardName() {
	var name = MarkovConstructor.construct(require('/home/pachet/burninggarden/cards.json'));

	name = name.replace(/[^A-Za-z]/g, '');

	var parts = name.slice(0, -1).split(' ');

	parts = parts.map(function map(part) {
		return part[0].toUpperCase() + part.slice(1);
	});

	name = parts.join('');

	return name.slice(0, 9);
}

/*
var server = new Pirc.Server({
	hostname: 'irc.burninggarden.com',
	motd:     'we will take from the land\nif it refuses to give!'
});

server.listen(6667);
*/

var client = new Pirc.Client();

client.connectToServer({
	hostname: '127.0.0.1',
	port:     6667,
	nick:     getRandomCardName()
}, function handler(error, server) {
	if (error) {
		return void handleError(error);
	}

	client.joinChannel('##javascript');
	client.joinChannel('#node.js');
	client.joinChannel('#jquery');
	client.joinChannel('#python');

	client.on('message', function handler(message) {
		if (!message.hasNick()) {
			return;
		}

		if (!message.hasChannel()) {
			return;
		}

		var
			nick         = message.getNick(),
			channel_name = message.getChannelName();

		console.log(channel_name + ' [' + nick + '] ' + message.getBody());

		queryNick(nick);
	});

	setInterval(function deferred() {
		var
			channel = client.getRandomChannel(),
			nick    = channel.getRandomNick();

		if (nick) {
			queryNick(nick);
		}

	}, 5000);

});

function queryNick(nick) {
	client.sendWhoisQueryForNick(nick, function handler(error, user) {
		if (error) {
			return void handleError(error);
		}

		var channel_names = user.getChannelNames();

		channel_names.forEach(function each(channel_name) {
			if (client.isInChannel(channel_name)) {
				return;
			}

			console.log('connecting to channel: ' + channel_name);

			try {
				client.joinChannel(channel_name);
			} catch (error) {
				if (!(error instanceof AlreadyInChannelError)) {
					return void handleError(error);
				}
			}
		});
	});
}

