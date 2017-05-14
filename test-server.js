var
	Pirc = require('./index');

var server = new Pirc.Server({
	name:          'BurningGarden',
	hostname:      'irc.burninggarden.com',
	// motd:          'we will take from the land\nif it refuses to give!',
	channel_modes: 'biklmnopstv'
});

server.listen(6668);

