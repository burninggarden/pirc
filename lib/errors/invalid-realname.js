
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidRealnameError extends BaseError {

	getMessage() {
		var reason = this.getReason();

		switch(reason) {
			case ErrorReasons.OMITTED:
				return 'Must specify a realname';
			default:
				return 'Invalid realname: ' + this.value;
		}
	}
}

extend(InvalidRealnameError.prototype, {
	code: ErrorCodes.INVALID_REALNAME
});

module.exports = InvalidRealnameError;
