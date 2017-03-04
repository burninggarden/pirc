
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class PermissionDeniedError extends BaseError {

	setMessage() {
		this.message = 'Permission Denied: ' + this.value;
	}

}

extend(PermissionDeniedError.prototype, {
	code:   ErrorCodes.PERMISSION_DENIED,
	reason: ErrorReasons.GENERIC
});

module.exports = PermissionDeniedError;
