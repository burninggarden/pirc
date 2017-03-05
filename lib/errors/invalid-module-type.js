
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidModuleTypeError extends BaseError {

	setMessage() {
		if (this.getReason() === ErrorReasons.OMITTED) {
			this.message = 'You must specify a module type';
		} else {
			this.message = 'Invalid module type: ' + this.value;
		}
	}

}

extend(InvalidModuleTypeError.prototype, {
	code: ErrorCodes.INVALID_MODULE_TYPE
});

module.exports = InvalidModuleTypeError;
