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
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies');


class Message_Command_Pong extends Message_Command {

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

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NOORIGIN,
			Enum_Replies.ERR_NOSUCHSERVER
		];
	}

}

extend(Message_Command_Pong.prototype, {
	command:         Enum_Commands.PONG,
	abnf:            '<hostname> [ " " <hostname> ]',
	origin_hostname: null,
	target_hostname: null
});

module.exports = Message_Command_Pong;
