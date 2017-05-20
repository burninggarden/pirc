
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');

class InvalidRealnameError extends BaseError {

	getBody() {
		var reason = this.getReason();

		switch (reason) {
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
