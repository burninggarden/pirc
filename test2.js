
var Pirc = require('./index');


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


var client = new Pirc.Client();

client.connectToServer({
	hostname: 'localhost',
	port:     6667,
	nick:     'crilbith'
}, function handler() {
	client.joinChannel('#ganondorf', function handler(error, channel) {
		if (error) {
			return void handleError(error);
		}

		client.setTopicForChannel(
			'Today\'s Pokemon: ' + getRandomPokemon(),
			'#ganondorf'
		);

		client.sendMessageToNick(
			'hey - is anyone there?',
			'victoire'
		);
	});

	client.on('message', function handler(message) {
		var type = getTypeForPokemon(message.getBody());

		if (!type) {
			return;
		}

		client.respondToMessage(message, type);

		var topic = 'Today\'s Pokemon: ' + message.getBody();

		client.setTopicForChannel(topic, '#ganondorf');
	});
});
