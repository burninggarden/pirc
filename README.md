# πrc
*("pie are sea")*

### A combination IRC daemon / client library for Node.js

## Table of Contents

- [Installation](#installation)
- [Introduction](#introduction)

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
