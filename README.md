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

|Setting name                |Default value                   |Meaning                                                                             |
|----------------------------|--------------------------------|------------------------------------------------------------------------------------|
|name                        |`"Pirc"`                        |Displayed to clients upon connecting                                                |
|hostname                    |`require('os').hostname()`      |Identifies the server to clients and other servers                                  |
|port                        |`6667` *(the default IRC port)* |The port the server should listen on                                                |
|channel_modes               |`"biklmnpstv"`                  |The subset of [supported channel modes](./docs/channel-modes) that clients can set  |
|user_modes                  |`"iosw"`                        |The subset of [supported user modes](./docs/user-modes) that clients can set        |
|max_channels                |`20`                            |The maximum number of channels a client can join                                    |
|max_targets                 |`20`                            |The maximum number of targets a client can specify for a message                    |
|max_bans                    |`60`                            |The maximum number of bans...... actually, I'm not sure how this is used            |
|max_parameters              |`32`                            |The maximum number of parameters a client can supply for a command                  |
|max_nick_length             |`32`                            |The maximum allowed client nick length                                              |
|max_topic_length            |`307`                           |The maximum allowed channel topic length                                            |


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


