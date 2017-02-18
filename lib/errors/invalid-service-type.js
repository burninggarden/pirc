
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidServiceTypeError extends BaseError {

	setMessage() {
		if (this.getReason() === ErrorReasons.OMITTED) {
			this.message = 'You must specify a service type';
		} else {
			this.message = 'Invalid service type: ' + this.value;
		}
	}

}

extend(InvalidServiceTypeError.prototype, {
	code: ErrorCodes.INVALID_SERVICE_TYPE
});

module.exports = InvalidServiceTypeError;
