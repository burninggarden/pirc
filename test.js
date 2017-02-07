

const POKEMON = [
	'pikachu',
	'charizard',
	'butterfree',
	'vaporeon',
	'haunter',
	'moltres',
	'blastoise',
	'venusaur',
	'hitmonlee'
];

const POKEMON_TYPES = {
	'pikachu':    'electric',
	'charizard':  'fire',
	'butterfree': 'grass/flying',
	'vaporeon':   'water',
	'haunter':    'ghost/psychic',
	'moltres':    'fire/flying',
	'blastoise':  'water',
	'venusaur':   'grass',
	'hitmonlee':  'fighting'
};


function getRandomPokemon() {
	var index = Math.floor(Math.random() * POKEMON.length);

	return POKEMON[index];
}


function getTypeForPokemon(pokemon) {
	return POKEMON_TYPES[pokemon] || null;
}


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

/*
var client = new Pirc.Client();

client.connectToServer({
	hostname: '127.0.0.1',
	port:     6667,
	nick:     'morrigan'
}, function handler(error) {
	if (error) {
		return void handleError(error);
	}

	var in_channel = false;

	function dispatch() {
		if (!in_channel) {
			client.joinChannel('#ganondorf', function handler(error, channel) {
				if (error) {
					return void handleError(error);
				}

				in_channel = true;

				client.sendMessageToChannel('hi!', '#ganondorf');

				setTimeout(dispatch, 2000);
			});
		} else {
			client.sendMessageToChannel('bye!', '#ganondorf');

			client.leaveChannel('#ganondorf', function handler(error) {
				if (error) {
					return void handleError(error);
				}

				console.log('WE ARE HERE!!!!!!!');

				in_channel = false;

				setTimeout(dispatch, 2000);
			});
		}
	}

	dispatch();
});
*/

/*
var client2 = new Pirc.Client();

client2.connectToServer({
	hostname: '127.0.0.1',
	port:     6667,
	nick:     'lilith'
}, function handler() {
	client2.joinChannel('#ganondorf', function handler(error, channel) {
		if (error) {
			return void handleError(error);
		}

		client2.setTopicForChannel(
			'Today\'s Pokemon: ' + getRandomPokemon(),
			'#ganondorf'
		);

		client2.sendMessageToNick(
			'hey - is anyone there?',
			'victoire'
		);
	});

	client2.on('message', function handler(message) {
		var type = getTypeForPokemon(message.getBody());

		if (!type) {
			return;
		}

		client2.respondToMessage(message, type);

		var topic = 'Today\'s Pokemon: ' + message.getBody();

		client2.setTopicForChannel(topic, '#ganondorf');
	});
});
*/

var regexes = require('./constants/regexes');
console.log(regexes.NICK);
