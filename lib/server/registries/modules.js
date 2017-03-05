
var
	add    = req('/utilities/add'),
	extend = req('/utilities/extend');


class ModuleRegistry {

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

extend(ModuleRegistry.prototype, {

	modules: null

});

module.exports = ModuleRegistry;
