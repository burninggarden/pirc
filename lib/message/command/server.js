

/**
 * From RFC2813:
 *
 * ##########################################################################
 *
 * 4.1.2 Server message
 *
 *       Command: SERVER
 *    Parameters: <servername> <hopcount> <token> <info>
 *
 *    The SERVER command is used to register a new server. A new connection
 *    introduces itself as a server to its peer.  This message is also used
 *    to pass server data over whole net.  When a new server is connected
 *    to net, information about it MUST be broadcasted to the whole
 *    network.
 *
 *    The <info> parameter may contain space characters.
 *
 *    <hopcount> is used to give all servers some internal information on
 *    how far away each server is.  Local peers have a value of 0, and each
 *    passed server increments the value.  With a full server list, it
 *    would be possible to construct a map of the entire server tree, but
 *    hostmasks prevent this from being done.
 *
 *    The <token> parameter is an unsigned number used by servers as an
 *    identifier.  This identifier is subsequently used to reference a
 *    server in the NICK and SERVICE messages sent between servers.  Server
 *    tokens only have a meaning for the point-to-point peering they are
 *    used and MUST be unique for that connection.  They are not global.
 *
 *    The SERVER message MUST only be accepted from either (a) a connection
 *    which is yet to be registered and is attempting to register as a
 *    server, or (b) an existing connection to another server, in which
 *    case the SERVER message is introducing a new server behind that
 *    server.
 *
 *    Most errors that occur with the receipt of a SERVER command result in
 *    the connection being terminated by the destination host (target
 *    SERVER).  Because of the severity of such event, error replies are
 *    usually sent using the "ERROR" command rather than a numeric.
 *
 *    If a SERVER message is parsed and it attempts to introduce a server
 *    which is already known to the receiving server, the connection, from
 *    which that message arrived, MUST be closed (following the correct
 *    procedures), since a duplicate route to a server has been formed and
 *    the acyclic nature of the IRC tree breaks.  In some conditions, the
 *    connection from which the already known server has registered MAY be
 *    closed instead.  It should be noted that this kind of error can also
 *    be the result of a second running server, problem which cannot be
 *    fixed within the protocol and typically requires human intervention.
 *    This type of problem is particularly insidious, as it can quite
 *    easily result in part of the IRC network to be isolated, with one of
 *    the two servers connected to each partition therefore making it
 *    impossible for the two parts to unite.
 *
 *    Numeric Replies:
 *
 *            ERR_ALREADYREGISTRED
 *
 *    Example:
 *
 *    SERVER test.oulu.fi 1 1 :Experimental server ; New server
 *                                    test.oulu.fi introducing itself and
 *                                    attempting to register.
 *
 *    :tolsun.oulu.fi SERVER csd.bu.edu 5 34 :BU Central Server ; Server
 *                                    tolsun.oulu.fi is our uplink for
 *                                    csd.bu.edu which is 5 hops away.  The
 *                                    token "34" will be used by
 *                                    tolsun.oulu.fi when introducing new
 *                                    users or services connected to
 *                                    csd.bu.edu.
 *
 * ##########################################################################
 */


var
	extend          = require('../../utility/extend'),
	Message_Command = require('../command'),
	Enum_Replies    = require('../../enum/replies'),
	Enum_Commands   = require('../../enum/commands');


class Message_Command_Server extends Message_Command {

	getHostname() {
		return this.hostname;
	}

	setHostname(hostname) {
		this.hostname = hostname;
		return this;
	}

	getHopCount() {
		return this.hop_count;
	}

	setHopCount(hop_count) {
		this.hop_count = hop_count;
		return this;
	}

	getServerToken() {
		return this.server_token;
	}

	setServerToken(server_token) {
		this.server_token = server_token;
		return this;
	}

	getServerInfo() {
		return this.server_info;
	}

	setServerInfo(server_info) {
		this.server_info = server_info;
		return this;
	}

	getValuesForParameters() {
		return {
			hostname:     this.getHostname(),
			hop_count:    this.getHopCount(),
			server_token: this.getServerToken(),
			server_info:  this.getServerInfo()
		};
	}

	setValuesFromParameters(parameters) {
		this.setHostname(parameters.get('hostname'));
		this.setHopCount(parameters.get('hopcount'));
		this.setServerToken(parameters.get('server_token'));
		this.setServerInfo(parameters.get('server_info'));
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_ALREADYREGISTRED
		];
	}

}

extend(Message_Command_Server, {

	fromServerConnection(server_connection) {
		var message = new Message_Command_Server();

		message.setHostname(server_connection.getHostname());
		message.setHopCount(server_connection.getHopCount() + 1);
		message.setServerToken(server_connection.getServerToken());

		return message;
	}

});

extend(Message_Command_Server.prototype, {
	command:      Enum_Commands.SERVER,
	abnf:         '<hostname> " " <hop-count> " " <server-token> [ " :" <server-info> ]',
	hostname:     null,
	hop_count:    null,
	server_token: null,
	server_info:  null
});

module.exports = Message_Command_Server;
