
var
	Pirc = require('./index');

var
	MessageGenerator = req('/lib/client/message-generator'),
	PartMessage      = req('/lib/client/messages/part'),
	NickMessage      = req('/lib/client/messages/nick'),
	JoinMessage      = req('/lib/client/messages/join');


const CLIENT_COUNT = 1;


function handleError(error) {
	console.error(error);
	process.exit(1);
}

function spawnClient() {
	var client = new Pirc.Client();

	client.connectToServer({
		hostname: '127.0.0.1',
		port:     6666,
		nick:     MessageGenerator.generateRandomNick()
	}, function handler(error, server) {
		if (error) {
			return void handleError(error);
		}

		setTimeout(function deferred() {
			var message = new JoinMessage();
			message.addChannelName('#gigabowser');

			client.getCurrentServerConnection().sendMessage(message);

			message = new NickMessage();
			message.setDesiredNick('skeeball');

			client.getCurrentServerConnection().sendMessage(message);

			message = new PartMessage();
			message.addChannelName('#gigabowser');

			client.getCurrentServerConnection().sendMessage(message);
		}, 2000);
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
