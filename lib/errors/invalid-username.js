
var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidUsernameError extends BaseError {

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.OMITTED:
				return 'Must specify a username';

			default:
				return 'Invalid username: ' + this.value;
		}
	}

}

extend(InvalidUsernameError.prototype, {
	code: ErrorCodes.INVALID_USERNAME
});

module.exports = InvalidUsernameError;
