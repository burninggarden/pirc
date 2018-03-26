
var
	extend = require('../../utility/extend');

var
	Enum_ModuleTypes = require('../../enum/module-types');


class Server_Module_Capabilities extends Server_Module {

	/**
	 * @param   {Server_Connection_Client} client
	 * @param   {Message} message
	 * @returns {void}
	 */
	handleClientMessage(client, message) {
		var command = message.getCommand();

		switch (command) {
			case Enum_Commands.CAP:
				return this.handleClientCapMessage(client, message);

			default:
				throw new Error('Unsupported command: ' + command);
		}
	}

	/**
	 * @param {Server_Connection_Client} client
	 * @param {Message} message
	 * @returns {void}
	 */
	handleClientCapMessage(client, message) {
	}

}

extend(Server_Module_Capabilities.prototype, {
	type: Enum_ModuleTypes.AUTHENTICATION
});

module.exports = Server_Module_Capabilities;
