
var
	extend           = require('../../utility/extend'),
	Server_Module    = require('../module'),
	Enum_ModuleTypes = require('../../enum/module-types');


class Server_Module_Network extends Server_Module {
}


extend(Server_Module_Network.prototype, {
	type: Enum_ModuleTypes.NETWORK
});

module.exports = Server_Module_Network;
