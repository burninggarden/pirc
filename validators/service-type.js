
var
	has = req('/utilities/has');

var
	ServiceTypes = req('/constants/service-types'),
	ErrorReasons = req('/constants/error-reasons');

var
	InvalidServiceTypeError = req('/lib/errors/invalid-service-type');



function validate(value) {
	if (has(ServiceTypes, value)) {
		return;
	}

	var reason;

	if (!value) {
		reason = ErrorReasons.OMITTED;
	} else {
		reason = ErrorReasons.WRONG_TYPE;
	}

	throw new InvalidServiceTypeError(value, reason);
}

module.exports = {
	validate
};
