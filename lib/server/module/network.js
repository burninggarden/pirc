var
	extend = require('../../utility/extend');

var
	Server_Module = require('../../server/module');


var
	Enum_Commands    = require('../../enum/commands'),
	Enum_ModuleTypes = require('../../enum/module-types');


class Server_Module_Network extends Server_Module {

	/**
	 * @param   {Server_Connection_Client} client
	 * @returns {void}
	 */
	coupleToClient(client) {
		// Noop for now.
	}

	/**
	 * @param   {Server_Connection_Client} client
	 * @returns {void}
	 */
	decoupleFromClient(client) {
		// Noop for now.
	}

	/**
	 * @param   {Server_Connection_Client} client
	 * @param   {Message} message
	 * @returns {void}
	 */
	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Enum_Commands.CONNECT:
				return this.handleClientConnectMessage(client, message);

			default:
				throw new Error(`Unsupported command: ${command}`);
		}
	}

	handleClientConnectMessage(client, message) {
		// working here
	}

}

extend(Server_Module_Network.prototype, {
	type: Enum_ModuleTypes.NETWORK
});

module.exports = Server_Module_Network;
