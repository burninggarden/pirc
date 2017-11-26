
var
	has              = require('../utility/has'),
	Enum_ModuleTypes = require('../enum/module-types');


function validate(value) {
	if (!has(Enum_ModuleTypes, value)) {
		throw new Error('Invalid module type: ' + value);
	}

}

module.exports = {
	validate
};
