
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class NotRegisteredError extends BaseError {

	getBody() {
		if (this.value) {
			return 'Not registered, command was rejected: ' + this.value;
		} else {
			return 'Not registered';
		}
	}

}

extend(NotRegisteredError.prototype, {
	code:   ErrorCodes.NOT_REGISTERED,
	reason: ErrorReasons.GENERIC
});

module.exports = NotRegisteredError;
