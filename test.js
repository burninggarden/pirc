var Pirc = require('./index');

var client = new Pirc.Client();

client.connectToServer({
	address: 'irc.burninggarden.com',
	port: 6667,
	nick: 'chaba'
}, function handler(error) {
	if (error) {
		console.warn(error);
	} else {
		console.log('yay');
	}
});
