
var
	has = req('/utilities/has');

var
	ModuleTypes  = req('/lib/constants/module-types'),
	ErrorReasons = req('/lib/constants/error-reasons');

var
	InvalidModuleTypeError = req('/lib/errors/invalid-module-type');



function validate(value) {
	if (has(ModuleTypes, value)) {
		return;
	}

	var reason;

	if (!value) {
		reason = ErrorReasons.OMITTED;
	} else {
		reason = ErrorReasons.WRONG_TYPE;
	}

	throw new InvalidModuleTypeError(value, reason);
}

module.exports = {
	validate
};
