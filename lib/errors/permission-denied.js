
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class PermissionDeniedError extends BaseError {

	getBody() {
		return 'Permission Denied: ' + this.value;
	}

}

extend(PermissionDeniedError.prototype, {
	code:   ErrorCodes.PERMISSION_DENIED,
	reason: ErrorReasons.GENERIC
});

module.exports = PermissionDeniedError;
