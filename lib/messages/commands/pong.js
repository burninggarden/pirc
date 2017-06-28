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
	extend         = req('/lib/utilities/extend'),
	CommandMessage = req('/lib/messages/command'),
	Commands       = req('/lib/constants/commands');


class PongMessage extends CommandMessage {

	getOriginServerName() {
		return this.origin_server_name;
	}

	setOriginServerName(server_name) {
		this.origin_server_name = server_name;
		return this;
	}

	getTargetServerName() {
		return this.target_server_name;
	}

	setTargetServerName(server_name) {
		this.target_server_name = server_name;
		return this;
	}

	getValuesForParameters() {
		return {
			server_name: [
				this.getOriginServerName(),
				this.getTargetServerName()
			]
		};
	}

	setValuesFromParameters(parameters) {
		this.setOriginServerName(parameters.getNext('server_name'));
		this.setTargetServerName(parameters.getNext('server_name'));
	}

}

extend(PongMessage.prototype, {
	command:            Commands.PONG,
	abnf:               '<server-name> [ <server-name> ]',
	origin_server_name: null,
	target_server_name: null
});

module.exports = PongMessage;
