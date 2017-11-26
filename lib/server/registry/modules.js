
var
	add    = require('../../utility/add'),
	extend = require('../../utility/extend');


class Server_Registry_Modules {

	constructor() {
		this.modules = [ ];
	}

	getModules() {
		return this.modules;
	}

	addModule(module) {
		add(module).to(this.getModules());
	}

	getModuleByType(module_type) {
		var
			index   = 0,
			modules = this.getModules();

		while (index < modules.length) {
			let module = modules[index];

			if (module.getType() === module_type) {
				return module;
			}

			index++;
		}

		return null;
	}

}

extend(Server_Registry_Modules.prototype, {

	modules: null

});

module.exports = Server_Registry_Modules;
