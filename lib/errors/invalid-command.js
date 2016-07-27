var req = require('req');

var
	extend       = req('/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/constants/error-codes'),
	ErrorReasons = req('/constants/error-reasons');

class InvalidCommandError extends BaseError {

	setMessage() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				this.message = 'You must specify a command';
				return;

			case ErrorReasons.WRONG_TYPE:
				this.message = 'Invalid command: ' + this.value;
				return;

			default:
				throw new Error('Invalid reason: ' + this.reason);
		}
	}

}

extend(InvalidCommandError.prototype, {
	code: ErrorCodes.INVALID_COMMAND
});

module.exports = InvalidCommandError;
