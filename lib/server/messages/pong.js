/**
 * From RFC1459:
 *
 * 4.6.3 Pong message
 *
 *       Command: PONG
 *    Parameters: <daemon> [<daemon2>]
 *
 *    PONG message is a reply to ping message.  If parameter <daemon2> is
 *    given this message must be forwarded to given daemon.  The <daemon>
 *    parameter is the name of the daemon who has responded to PING message
 *    and generated this message.
 *
 *    Numeric Replies:
 *
 *            ERR_NOORIGIN                    ERR_NOSUCHSERVER
 *
 *    Examples:
 *
 *    PONG csd.bu.edu tolsun.oulu.fi  ; PONG message from csd.bu.edu to
 *                                      tolsun.oulu.fi
 */

var
	extend        = req('/utilities/extend'),
	ServerMessage = req('/lib/server/message'),
	Commands      = req('/constants/commands');


class ServerPongMessage extends ServerMessage {

	isFromServer() {
		return true;
	}

	serializeParams() {
		var hostname = this.getServerDetails().getHostname();

		return `${hostname} :${hostname}`;
	}

	applyParsedParams(middle_params, trailing_param) {
		this.getServerDetails().setHostname(trailing_param);
	}

}

extend(ServerPongMessage.prototype, {
	command: Commands.PONG

});

module.exports = ServerPongMessage;
