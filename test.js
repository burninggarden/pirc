
var Pirc = require('./index');

var MarkovConstructor = require('/home/pachet/burninggarden/utility/markov/constructor');


const CLIENT_COUNT = 1;


function handleError(error) {
	console.error(error);
	process.exit(1);
}

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



function spawnClient() {
	var client = new Pirc.Client();

	client.connectToServer({
		hostname: '127.0.0.1',
		port:     6666,
		nick:     getRandomCardName()
	}, function handler(error, server) {
		if (error) {
			return void handleError(error);
		}

		client.joinChannel('##javascript');
		client.joinChannel('#node.js');
		client.joinChannel('#jquery');
		client.joinChannel('#ubuntu');
		client.joinChannel('#css');

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

			queryNickForClient(nick, client);
		});

		setInterval(function deferred() {
			var channel = client.getRandomChannel();

			if (!channel) {
				return;
			}

			var nick = channel.getRandomNick();

			if (nick) {
				queryNickForClient(nick, client);
			}

		}, 5000);

		setTimeout(function deferred() {
			queryNickForClient('oogaw', client);
		}, 5000);
	});
}

function queryNickForClient(nick, client) {
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

			client.joinChannel(channel_name, function handler(error) {
				if (error) {
					console.error(error);
				}
			});
		});
	});
}

var server = new Pirc.Server({
	name:     'BurningGarden',
	hostname: 'irc.burninggarden.com',
	motd:     'we will take from the land\nif it refuses to give!'
});

server.listen(6668);

var index = 0;

while (index < CLIENT_COUNT) {
	spawnClient();
	index++;
}
