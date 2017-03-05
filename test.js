
var
	Pirc = require('./index');

var
	MessageGenerator = req('/lib/client/message-generator');


const CLIENT_COUNT = 1;


function handleError(error) {
	console.error(error);
	process.exit(1);
}

function spawnClient() {
	var
		client = new Pirc.Client(),
		nick   = MessageGenerator.generateRandomNick();

	client.connectToServer({
		hostname: '127.0.0.1',
		port:     6666,
		nick:     nick
	}, function handler(error, server) {
		if (error) {
			return void handleError(error);
		}

		client.joinChannel('#madrigosa', function handler(error, channel) {
			client.sendRawMessage('MODE #madrigosa +k foobar');
			client.sendRawMessage('MODE #madrigosa -k');
		});

		/*
		setInterval(function deferred() {
			try {
				client.sendRandomCommandMessage();
			} catch (error) {
				console.log(error);
			}
		}, Math.floor(Math.random() * 2000) + 500);
		*/
	});
}

var server = new Pirc.Server({
	name:          'BurningGarden',
	hostname:      'irc.burninggarden.com',
	motd:          'we will take from the land\nif it refuses to give!',
	channel_modes: 'biklmnopstv'
});

server.listen(6668);

var index = 0;

while (index < CLIENT_COUNT) {
	spawnClient();
	index++;
}
