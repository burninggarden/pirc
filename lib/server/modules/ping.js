/**
 * The Ping module is responsible for terminating unresponsive connections.
 *
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.7.2 Ping message
 *
 *       Command: PING
 *    Parameters: <server1> [ <server2> ]
 *
 *    The PING command is used to test the presence of an active client or
 *    server at the other end of the connection.  Servers send a PING
 *    message at regular intervals if no other activity detected coming
 *    from a connection.  If a connection fails to respond to a PING
 *    message within a set amount of time, that connection is closed.  A
 *    PING message MAY be sent even if the connection is active.
 *
 *    When a PING message is received, the appropriate PONG message MUST be
 *    sent as reply to <server1> (server which sent the PING message out)
 *    as soon as possible.  If the <server2> parameter is specified, it
 *    represents the target of the ping, and the message gets forwarded
 *    there.
 *
 *    Numeric Replies:
 *
 *            ERR_NOORIGIN                  ERR_NOSUCHSERVER
 *
 *    Examples:
 *
 *    PING tolsun.oulu.fi             ; Command to send a PING message to
 *                                    server
 *
 *    PING WiZ tolsun.oulu.fi         ; Command from WiZ to send a PING
 *                                    message to server "tolsun.oulu.fi"
 *
 *    PING :irc.funet.fi              ; Ping message sent by server
 *                                    "irc.funet.fi"
 *
 * ##########################################################################
 *
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
 * ##########################################################################
 *
 *
 * From RFC1459:
 *
 * ##########################################################################
 *
 * 4.6.2 Ping message
 *
 *       Command: PING
 *    Parameters: <server1> [<server2>]
 *
 *    The PING message is used to test the presence of an active client at
 *    the other end of the connection.  A PING message is sent at regular
 *    intervals if no other activity detected coming from a connection.  If
 *    a connection fails to respond to a PING command within a set amount
 *    of time, that connection is closed.
 *
 *    Any client which receives a PING message must respond to <server1>
 *    (server which sent the PING message out) as quickly as possible with
 *    an appropriate PONG message to indicate it is still there and alive.
 *    Servers should not respond to PING commands but rely on PINGs from
 *    the other end of the connection to indicate the connection is alive.
 *    If the <server2> parameter is specified, the PING message gets
 *    forwarded there.
 *
 *    Numeric Replies:
 *
 *            ERR_NOORIGIN                    ERR_NOSUCHSERVER
 *
 *    Examples:
 *
 *    PING tolsun.oulu.fi             ; server sending a PING message to
 *                                    another server to indicate it is still
 *                                    alive.
 *
 *    PING WiZ                        ; PING message being sent to nick WiZ
 *
 * ##########################################################################
 *
 */


var
	extend = req('/lib/utilities/extend'),
	add    = req('/lib/utilities/add'),
	remove = req('/lib/utilities/remove');

var
	Module        = req('/lib/server/module'),
	TimeIntervals = req('/lib/constants/time-intervals'),
	Commands      = req('/lib/constants/commands'),
	ErrorReasons  = req('/lib/constants/error-reasons'),
	ModuleTypes   = req('/lib/constants/module-types');

var
	InvalidCommandError = req('/lib/errors/invalid-command');

var
	PingMessage = req('/lib/messages/commands/ping'),
	PongMessage = req('/lib/messages/commands/pong');


const
	PING_INTERVAL = TimeIntervals.ONE_SECOND * 5000,
	PONG_TIMEOUT  = TimeIntervals.ONE_SECOND * 2.5;


class PingModule extends Module {

	constructor() {
		super();

		this.clients           = [ ];
		this.client_ping_times = { };
		this.client_pong_times = { };

		setInterval(this.checkAllClientTimes.bind(this), 1000);
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
			case Commands.PING:
				return this.handleClientPingMessage(client, message);

			case Commands.PONG:
				return this.handleClientPongMessage(client, message);

			default:
				throw new InvalidCommandError(command, ErrorReasons.UNSUPPORTED);
		}
	}

	handleClientPongMessage(client, message) {
		var id = client.getId();

		this.client_pong_times[id] = Date.now();
	}

	handleClientPingMessage(client, message) {
		var pong_message = new PongMessage();

		pong_message.setLocalServerDetails(this.getLocalServerDetails());

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
		var message = new PingMessage();

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

extend(PingModule.prototype, {
	type:              ModuleTypes.PING,
	clients:           null,
	client_ping_times: null,
	client_pong_times: null
});

module.exports = PingModule;
