var
	Pirc = require('./index');

var server = new Pirc.Server({
	name:          'πrc',
	hostname:      'irc.myserver.com',
	motd:          'we will take from the land if it refuses to give!',
	channel_modes: 'biklmnopstv',
	log_incoming_messages: true,
	log_outgoing_messages: true
});

server.listen(6667);
