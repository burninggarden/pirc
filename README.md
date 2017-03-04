# πrc
*("pie are sea")*

### A combination IRC daemon / client library for Node.js

## Table of Contents

- [Installation](#installation)
- [Introduction](#introduction)
- [Server config](#server-config)
- [Client config](#client-config)
- [Client scripting](#client-scripting)

## Installation

`npm install pirc`

## Introduction

**πrc** is both an IRC daemon, and an IRC client, all rolled into one module.
It's written in JavaScript.

Starting your own IRC server is easy:

`````js
var Pirc = require('pirc');

var server = new Pirc.Server();

server.listen();

// Server is now listening on port 6667!

`````

So is spawning an IRC client:

`````js

var Pirc = require('pirc');

var client = new Pirc.Client('pachet');

client.connectToServer('irc.burninggarden.com', function(error) {
	if (error) {
		throw error;
	}

	// We're now successfully connected! Yay!

	client.joinChannel('#sysops', function(error) { // JOIN #sysops
		if (error) {
			throw error;
		}

		client.sendMessageToChannel('I have returned!', channel); // PRIVMSG #sysops :I have returned!
	});
});

`````


## Server Config

Technically, you don't need to supply any additional options when you create a new server instance:

`````js
(new Pirc.Server()).listen();
`````

The above example creates a new server instance, using the default settings, and has it start listening on port 6667.

The default settings are as follows:

|Setting name                |Default value                                                    |Meaning                                                                             |
|----------------------------|-----------------------------------------------------------------|------------------------------------------------------------------------------------|
|name                        |`"Pirc"`                                                         |Displayed to clients upon connecting                                                |
|hostname                    |[`OS.hostname()`](https://nodejs.org/api/os.html#os_os_hostname) |Identifies the server to clients and other servers                                  |
|port                        |`6667`                                                           |The port the server should listen on                                                |
|motd                        |`null`                                                           |The MOTD to show to connecting clients
|channel_modes               |`"biklmnpstv"`                                                   |The subset of [supported channel modes](./docs/channel-modes) that clients can set  |
|user_modes                  |`"iosw"`                                                         |The subset of [supported user modes](./docs/user-modes) that clients can set        |
|max_channels                |`20`                                                             |The maximum number of channels a client can join                                    |
|max_targets                 |`20`                                                             |The maximum number of targets a client can specify for a message                    |
|max_bans                    |`60`                                                             |The maximum number of ban masks allowed for a given channel                         |
|max_parameters              |`32`                                                             |The maximum number of parameters allowed for a given command                        |
|max_nick_length             |`32`                                                             |The maximum allowed client nick length                                              |
|max_topic_length            |`307`                                                            |The maximum allowed channel topic length                                            |


You will probably want to override these settings. To do so, you can supply an options object to the `Pirc.Server` constructor:
`````js
var server = new Pirc.Server({
	name:          'BurningGarden',
	hostname:      'irc.burninggarden.com',
	port:          1234,
	motd:          'Welcome to Burning Garden's IRC server. Be good, and don't be bad!'
	channel_modes: 'bmnpsq',
	user_modes:    'ars'
});
`````

In addition to specifying the port in the options object, you can also just pass it to `server.listen()` directly:
`````js
server.listen(1234);
`````

A list of πrc's supported channel modes, and their meanings, can be found [here](./docs/channel-modes).

A list of πrc's supported user modes, and their meanings, can be found [here](./docs/user-modes).



## Client Config

The amount of information needed when instantiating a new client is minimal. In fact, you could just instantiate a client directly, and call `connectToServer()` without supplying any additional information:

`````js
var client = new Pirc.Client(); // The default nick, "pirc", will be used.

client.connectToServer(function(error) { // Will attempt to connect to localhost:6667
	// Do something
});

`````

But I'm guessing you want more flexibility than that. Not a problem. You can override the default nick for your client by passing it directly to the `Pirc.Client` constructor:

`````js
var client = new Pirc.Client('pachet'); // Now the nick "pachet" will be used when connecting to servers
`````

You can also specify additional options when connecting to a specific server, in the form of an options object:

`````js
var client = new Pirc.Client();

var options = {
	hostname: 'irc.burninggarden.com',
	port:     6669,
	nick:     'pachet',
	username: 'pachet',
	realname: 'Pachet'
};

client.connectToServer(options, function(error) {
	// Do something
});
`````

This makes it easy to specify different values for different server connections using the same client.

The default values for the options object when connecting to a server is as follows:

|Setting name  |Default value  |Meaning                                                               |
|--------------|---------------|----------------------------------------------------------------------|
|nick          |`"pirc"`       |Identifies your client on the network, unique to your user            |
|username      |`"pirc"`       |Identifies your client on the network, not necessarily unique to you  |
|realname      |`"Pirc"`       |Your favorite character on your favorite TV show                      |
|hostname      |`"localhost"`  |The remote hostname of the server to connect to                       |
|port          |`6667`         |The remote port of the server to connect to                           |


## Client scripting

If you're writing an IRC client using **πrc**, you probably want some way to programmatically interact with the IRC networks you're connecting to.

Here's an example of a simple bot written using `Pirc.Client`, just to serve as an illustration of what's possible. More comprehensive documentation can be found below.

`````js
var Pirc = require('pirc');

var client = new Pirc.Client();

function handleError(error) {
	console.error(error);
	process.exit(1);
}

client.connectToServer('irc.burninggarden.com', function(error) {
	if (error) {
		return void handleError(error);
	}

	// Connect to some initial channels:
	client.joinChannel('#sysops');
	client.joinChannel('#zeldafans');
	client.joinChannel('#seriousbusiness');

	client.on('message', function(message) {
		// Reply to the message we received:
		client.respondToMessage(message, 'What in the world are you talking about?');

		var nick = message.getNick();

		if (!nick) {
			// Some messages don't have nicks; ie, server notice messages.
			return;
		}

		client.sendWhoisQueryForNick(nick, function(error, user) {
			if (error) {
				return void handleError(error);
			}

			// Crawl throughout the network:
			user.getChannelNames().forEach(client.joinChannel, client);
		});
	});
});

`````
