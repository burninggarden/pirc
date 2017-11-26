
var
	extend          = require('../../utility/extend'),
	Message_Command = require('../../message/command'),
	Enum_Commands   = require('../../enum/commands');


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

}

extend(Message_Command_Connect.prototype, {
	command:       Enum_Commands.CONNECT,
	abnf:          '<hostname> " " <port> [ " " <hostname> ]',
	target_server: null,
	port:          null,
	remote_server: null
});

module.exports = Message_Command_Connect;
