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


var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');


class ServerPingMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

	serializeParams() {
		return ':' + this.getBody();
	}

	getBody() {
		return this.getServerDetails().getHostname();
	}

	applyParsedParams(middle_params, trailing_param) {
		if (middle_params.length !== 0) {
			throw new Error('Invalid middle params');
		}

		this.getServerDetails().setHostname(trailing_param);
	}

}

extend(ServerPingMessage.prototype, {
	command: Commands.PING

});

module.exports = ServerPingMessage;
