
var
	has              = req('/lib/utilities/has'),
	Enum_ModuleTypes = req('/lib/enum/module-types');


function validate(value) {
	if (!has(Enum_ModuleTypes, value)) {
		throw new Error('Invalid module type: ' + value);
	}

}

module.exports = {
	validate
};
