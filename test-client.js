
var
	Pirc = require('./index');

/*
var
	MessageGenerator = require('./lib/client/message-generator');
*/


const CLIENT_COUNT = 2;


function handleError(error) {
	console.error(error);
	process.exit(1);
}

function spawnClient() {
	var
		client = new Pirc.Client(),
		// nick   = MessageGenerator.generateRandomNick();
		nickname = 'cloudbreaker';

	client.connectToServer({
		hostname: '127.0.0.1',
		port:     6668,
		nickname: nickname
	}, function handler(error, server) {
		if (error) {
			return void handleError(error);
		}

		// var delay = Math.floor(Math.random() * 2000) + 500;
		var delay = 250;

		/*
		setInterval(function deferred() {
			try {
				client.sendRandomCommandMessage();
			} catch (error) {
				console.log(error);
			}
		}, delay);
		*/
	});
}


var index = 0;

while (index < CLIENT_COUNT) {
	spawnClient();
	index++;
}
