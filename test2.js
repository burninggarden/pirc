
var Pirc = require('./index');

var MarkovConstructor = require('/home/pachet/burninggarden/utility/markov/constructor');


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

function getRandomCardName() {
	var name = MarkovConstructor.construct(require('/home/pachet/burninggarden/cards.json'));

	var parts = name.slice(0, -1).split(' ');

	parts = parts.map(function map(part) {
		return part[0].toUpperCase() + part.slice(1);
	});

	name = parts.join('');

	return name.slice(0, 9);
}


var client = new Pirc.Client();

client.connectToServer({
	hostname: 'localhost',
	port:     6667,
	nick:     getRandomCardName()
}, function handler(error) {
	if (error) {
		return void handleError(error);
	}

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

	client.joinChannel('##javascript');
	client.joinChannel('#jquery');
	client.joinChannel('#node.js');

	client.on('message', function handler(message) {
		var type = getTypeForPokemon(message.getBody());

		if (type) {
			client.respondToMessage(message, type);

			var topic = 'Today\'s Pokemon: ' + message.getBody();

			client.setTopicForChannel(topic, '#ganondorf');
		}

		if (!message.hasChannel()) {
			return;
		}

		if (!message.hasUser()) {
			return;
		}

		var nick = message.getNick();

		client.sendWhoisQueryForNick(nick, function handler(error, user_details) {
			user_details.getChannelNames().forEach(function each(channel_name) {
				try {
					client.joinChannel(channel_name);
				} catch (error) {
					// Drop on floor
				}
			});
		});
	});
});
