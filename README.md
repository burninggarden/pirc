# πrc
*("pie are sea")*

### A combination IRC daemon / client library for Node.js

## Table of Contents

- [Installation](#installation)
- [Introduction](#introduction)
- [Server config](#server-config)

## Installation

`npm install pirc`

## Introduction

πrc is both an IRC daemon, and an IRC client, all rolled into one module.
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

client.connectToServer('irc.burninggarden.com', function(error, server) {
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

|Setting name |Default value                                          |
|-------------|--------------------------                             |
|name         |Pirc                                                   |
|hostname     |The result of `require('os').hostname()` on your system|
|port         |6667 (the default IRC port)                            |
|channel_modes|biklmnpstv                                             |
|user_modes   |iosw                                                   |

You will probably want to override these settings. To do so, you can supply an options object to the `Pirc.Server` constructor:
`````js
var server = new Pirc.Server({
	name:          'BurningGarden',
	hostname:      'irc.burninggarden.com',
	port:          1234,
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


