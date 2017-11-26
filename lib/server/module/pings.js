/**
 * The Ping module is responsible for terminating unresponsive connections.
 *
 * From RFC2813:
 *
 * ##########################################################################
 *
 * 5.1 Connection 'Liveness'
 *
 *    To detect when a connection has died or become unresponsive, the
 *    server MUST poll each of its connections.  The PING command (See "IRC
 *    Client Protocol" [IRC-CLIENT]) is used if the server doesn't get a
 *    response from its peer in a given amount of time.
 *
 *    If a connection doesn't respond in time, its connection is closed
 *    using the appropriate procedures.
 *
 */


var
	extend = require('../../utility/extend'),
	add    = require('../../utility/add'),
	remove = require('../../utility/remove');

var
	Server_Module = require('../../server/module');

var
	Enum_TimeIntervals = require('../../enum/time-intervals'),
	Enum_Commands      = require('../../enum/commands'),
	Enum_ModuleTypes   = require('../../enum/module-types');

var
	Message_Command_Ping = require('../../message/command/ping'),
	Message_Command_Pong = require('../../message/command/pong');


const
	PING_INTERVAL = Enum_TimeIntervals.ONE_SECOND * 5000,
	PONG_TIMEOUT  = Enum_TimeIntervals.ONE_SECOND * 2.5;


class Server_Module_Pings extends Server_Module {

	constructor() {
		super();

		this.clients           = [ ];
		this.client_ping_times = { };
		this.client_pong_times = { };

		setInterval(this.checkAllClientTimes.bind(this), 1000);
	}

	getHostname() {
		return this.getServerDetails().getHostname();
	}

	coupleToClient(client) {
		add(client).to(this.clients);

		var id = client.getId();

		this.client_ping_times[id] = Date.now();
		this.client_pong_times[id] = Date.now();
	}

	decoupleFromClient(client) {
		remove(client).from(this.clients);

		var id = client.getId();

		delete this.client_ping_times[id];
		delete this.client_pong_times[id];
	}

	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Enum_Commands.PING:
				return this.handleClientPingMessage(client, message);

			case Enum_Commands.PONG:
				return this.handleClientPongMessage(client, message);

			default:
				throw new Error('Invalid command: ' + command);
		}
	}

	handleClientPongMessage(client, message) {
		var id = client.getId();

		this.client_pong_times[id] = Date.now();
	}

	handleClientPingMessage(client, message) {
		var pong_message = new Message_Command_Pong();

		pong_message.setOriginHostname(this.getHostname());

		client.sendMessage(pong_message);
	}

	checkAllClientTimes() {
		this.clients.forEach(this.checkClientTimes, this);
	}

	shouldSendPingToClient(client) {
		var
			id        = client.getId(),
			ping_time = this.client_ping_times[id],
			delta     = Date.now() - ping_time;

		return delta > PING_INTERVAL;
	}

	isClientOverPongTimeout(client) {
		var
			id        = client.getId(),
			ping_time = this.client_ping_times[id],
			pong_time = this.client_pong_times[id];

		if (pong_time >= ping_time) {
			return false;
		}

		var delta = Date.now() - ping_time;

		return delta > PONG_TIMEOUT;
	}

	sendPingToClient(client) {
		var message = new Message_Command_Ping();

		if (client.isServer()) {
			message.setTargetHostname(client.getHostname());
		}

		// Note: No need to explicitly set the target nick,
		// in the event that it isn't a server we're talking to.
		// This is done automatically when server messages are
		// dispatched to the designated client recipient.

		var id = client.getId();

		this.client_ping_times[id] = Date.now();

		return void client.sendMessage(message);
	}

	checkClientTimes(client) {
		if (this.isClientOverPongTimeout(client)) {
			this.killClient(client);
		} else if (this.shouldSendPingToClient(client)) {
			this.sendPingToClient(client);
		}
	}

	killClient(client) {
		client.destroy();
	}

}

extend(Server_Module_Pings.prototype, {
	type:              Enum_ModuleTypes.PINGS,
	clients:           null,
	client_ping_times: null,
	client_pong_times: null
});

module.exports = Server_Module_Pings;
