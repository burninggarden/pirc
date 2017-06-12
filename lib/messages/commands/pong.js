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
	extend        = req('/lib/utilities/extend'),
	ClientMessage = req('/lib/client/message'),
	Commands      = req('/lib/constants/commands');


class ClientPongMessage extends ClientMessage {

	serializeParameters() {
		return ':' + this.getServerRemoteDetails().getHostname();
	}

	applyParsedParameters(middle_parameters, trailing_parameter) {
		// NOTICE: We ignore any middle parameters here.
		if (trailing_parameter) {
			let server_details = this.getOrCreateRemoteServerDetails();

			server_details.setHostname(trailing_parameter);
		}
	}

}

extend(ClientPongMessage.prototype, {
	command: Commands.PONG
});

module.exports = ClientPongMessage;
