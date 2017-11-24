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
	Enum_Commands  = req('/lib/enum/commands');


class PongMessage extends CommandMessage {

	getOriginHostname() {
		return this.origin_hostname;
	}

	setOriginHostname(hostname) {
		this.origin_hostname = hostname;
		return this;
	}

	getTargetHostname() {
		return this.target_hostname;
	}

	setTargetHostname(hostname) {
		this.target_hostname = hostname;
		return this;
	}

	getValuesForParameters() {
		return {
			hostname: [
				this.getOriginHostname(),
				this.getTargetHostname()
			]
		};
	}

	setValuesFromParameters(parameters) {
		this.setOriginHostname(parameters.getNext('hostname'));
		this.setTargetHostname(parameters.getNext('hostname'));
	}

}

extend(PongMessage.prototype, {
	command:         Enum_Commands.PONG,
	abnf:            '<hostname> [ <hostname> ]',
	origin_hostname: null,
	target_hostname: null
});

module.exports = PongMessage;
