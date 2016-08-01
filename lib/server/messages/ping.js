/**
 * From RFC2813:
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
 * From RFC1459:
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
 */


var req = require('req');

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');



class ServerPingMessage extends ServerMessage {

	/**
	 * @returns {string}
	 */
	serialize() {
		if (this.isDestinedForServer()) {
			return `PING ${this.target_hostname}`;
		} else {
			return `PING ${this.target_nick}`;
		}
	}

	deserialize() {
	}

	/**
	 * @param   {string} target_nick
	 * @returns {self}
	 */
	setTargetNick(target_nick) {
		this.target_nick = target_nick;

		return this;
	}

	/**
	 * @param   {string} target_hostname
	 * @returns {self}
	 */
	setTargetHostname(target_hostname) {
		this.target_hostname = target_hostname;

		return this;
	}

	/**
	 * @returns {boolean}
	 */
	isDestinedForServer() {
		return this.target_hostname !== null;
	}

}

extend(ServerPingMessage.prototype, {
	command:         Commands.PING,
	target_nick:     null,
	target_hostname: null

});

module.exports = ServerPingMessage;
