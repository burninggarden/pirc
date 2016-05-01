var Pirc = require('./index');

var server = new Pirc.Server();

server.listen(6667);

var client = new Pirc.Client();

client.connectToServer({
	address: '127.0.0.1',
	port: 6667,
	nick: 'chaba'
}, function handler(error) {
	if (error) {
		console.warn(error);
	} else {
		console.log('yay');
	}
});
