
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class NotRegisteredError extends BaseError {

	setMessage() {
		if (this.value) {
			this.message = `Not registered, command was rejected: ${this.value}`;
		} else {
			this.message = 'Not registered';
		}
	}

}

extend(NotRegisteredError.prototype, {
	code:   ErrorCodes.NOT_REGISTERED,
	reason: ErrorReasons.GENERIC
});

module.exports = NotRegisteredError;
