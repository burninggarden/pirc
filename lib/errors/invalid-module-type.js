
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidModuleTypeError extends BaseError {

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.OMITTED:
				return 'You must specify a module type';
			default:
				return 'Invalid module type: ' + this.value;
		}
	}

}

extend(InvalidModuleTypeError.prototype, {
	code: ErrorCodes.INVALID_MODULE_TYPE
});

module.exports = InvalidModuleTypeError;
