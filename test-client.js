
var
	Pirc = require('./index');

var
	MessageGenerator = require('./lib/client/message-generator');


const CLIENT_COUNT = 2;


function handleError(error) {
	console.error(error);
	process.exit(1);
}

function spawnClient(index) {
	var
		client = new Pirc.Client(),
		nickname   = MessageGenerator.generateRandomNick();

	client.connectToServer({
		hostname: '127.0.0.1',
		port:     6667,
		nickname: nickname,
		log_incoming_messages: true,
		log_outgoing_messages: true
	}, function handler(error, server) {
		if (error) {
			return void handleError(error);
		}

		const channel = '#sysops';

		client.joinChannel(channel, function handler(error) {
			if (error) {
				return void handleError(error);
			}

			if (index > 0) {
				return;
			}

			// var delay = Math.floor(Math.random() * 2000) + 500;
			var delay = 250;

			setInterval(function deferred() {
				const message = MessageGenerator.generateRandomBodyText();

				try {
					client.sendMessageToChannel(message, channel);
				} catch (error) {
					console.log(error);
				}
			}, delay);
		});

		if (index !== 1) {
			return;
		}

		client.on('message', function handler(message) {
			if (!message.hasChannel()) {
				return;
			}

			const channel = message.getChannelName();
			const body = message.getBody();
			const topic = body.split(' ').reverse().join(' ');

			client.setTopicForChannel(topic, channel);
		});
	});
}


var index = 0;

while (index < CLIENT_COUNT) {
	spawnClient(index);
	index++;
}
