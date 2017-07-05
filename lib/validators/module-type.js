
var
	has         = req('/lib/utilities/has'),
	ModuleTypes = req('/lib/constants/module-types');


function validate(value) {
	if (!has(ModuleTypes, value)) {
		throw new Error('Invalid module type: ' + value);
	}

}

module.exports = {
	validate
};
