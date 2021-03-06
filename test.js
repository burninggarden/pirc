
var
	Pirc = require('./index');

var
	MessageGenerator = require('./lib/client/message-generator');


const CLIENT_COUNT = 4;


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
		port:     6668,
		nick:     nick
	}, function handler(error, server) {
		if (error) {
			return void handleError(error);
		}

		var delay = Math.floor(Math.random() * 2000) + 500;

		setInterval(function deferred() {
			client.sendRandomCommandMessage();
		}, delay);
	});
}

var server = new Pirc.Server({
	name:          'πrc',
	hostname:      'irc.myserver.com',
	motd:          'we will take from the land\nif it refuses to give!',
	channel_modes: 'biklmnopstv'
});

server.listen(6668);

var index = 0;

while (index < CLIENT_COUNT) {
	spawnClient();
	index++;
}
