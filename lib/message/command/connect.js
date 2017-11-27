/**
 * From RFC2812:
 *
 * ##########################################################################
 *
 * 3.4.7 Connect message
 *
 *       Command: CONNECT
 *    Parameters: <target server> <port> [ <remote server> ]
 *
 *    The CONNECT command can be used to request a server to try to
 *    establish a new connection to another server immediately.  CONNECT is
 *    a privileged command and SHOULD be available only to IRC Operators.
 *    If a <remote server> is given and its mask doesn't match name of the
 *    parsing server, the CONNECT attempt is sent to the first match of
 *    remote server. Otherwise the CONNECT attempt is made by the server
 *    processing the request.
 *
 *    The server receiving a remote CONNECT command SHOULD generate a
 *    WALLOPS message describing the source and target of the request.
 *
 *    Numeric Replies:
 *
 *            ERR_NOSUCHSERVER              ERR_NOPRIVILEGES
 *            ERR_NEEDMOREPARAMS
 *
 *    Examples:
 *
 *    CONNECT tolsun.oulu.fi 6667     ; Command to attempt to connect local
 *                                      server to tolsun.oulu.fi on port 6667
 *
 * ##########################################################################
 */

var
	Heket           = require('heket'),
	extend          = require('../../utility/extend'),
	Message_Command = require('../command'),
	Enum_Commands   = require('../../enum/commands'),
	Enum_Replies    = require('../../enum/replies');


var
	Message_Reply_NeedMoreParameters = require('../reply/need-more-parameters');


class Message_Command_Connect extends Message_Command {

	/**
	 * @returns {string}
	 */
	getTargetServer() {
		return this.target_server;
	}

	/**
	 * @param   {string} target_server
	 * @returns {self}
	 */
	setTargetServer(target_server) {
		this.target_server = target_server;
		return this;
	}

	/**
	 * @returns {string}
	 */
	getRemoteServer() {
		return this.remote_server;
	}

	/**
	 * @param   {string} remote_server
	 * @returns {self}
	 */
	setRemoteServer(remote_server) {
		this.remote_server = remote_server;
		return this;
	}

	/**
	 * @returns {boolean}
	 */
	hasRemoteServer() {
		return this.getRemoteServer() !== null;
	}

	/**
	 * @returns {int}
	 */
	getPort() {
		return this.port;
	}

	/**
	 * @param   {int} port
	 * @returns {self}
	 */
	setPort(port) {
		this.port = port;
		return this;
	}

	getValuesForParameters() {
		return {
			hostname: [
				this.getTargetServer(),
				this.getRemoteServer()
			],
			port: this.getPort()
		};
	}

	setValuesFromParameters(parameters) {
		this.setTargetServer(parameters.getNext('hostname'));
		this.setPort(parameters.get('port'));
		this.setRemoteServer(parameters.getNext('hostname'));
	}

	getPossibleReplies() {
		return [
			Enum_Replies.ERR_NOSUCHSERVER,
			Enum_Replies.ERR_NEEDMOREPARAMS,
			Enum_Replies.ERR_NOPRIVILEGES
		];
	}

	handleParameterParsingError(error) {
		if (error instanceof Heket.InputTooShortError) {
			let message = new Message_Reply_NeedMoreParameters();

			message.setAttemptedCommand(Enum_Commands.CONNECT);

			return this.setImmediateResponse(message);
		}
	}

}

extend(Message_Command_Connect.prototype, {
	command:       Enum_Commands.CONNECT,
	abnf:          '<hostname> " " <port> [ " " <hostname> ]',
	target_server: null,
	port:          null,
	remote_server: null
});

module.exports = Message_Command_Connect;
