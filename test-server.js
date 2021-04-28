var
	Pirc = require('./index');

var server = new Pirc.Server({
	name:          'πrc',
	hostname:      'irc.myserver.com',
	motd:          'we will take from the land if it refuses to give!',
	channel_modes: 'biklmnopstv'
});

server.listen(6667);
