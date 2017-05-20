
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons');


class InvalidCommandError extends BaseError {

	constructor(value, reason) {
		super(value, reason);

		this.setCommand(value);
	}

	getBody() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				return 'You must specify a command';
			case ErrorReasons.WRONG_TYPE:
				return 'Invalid command: ' + this.value;
			case ErrorReasons.UNSUPPORTED:
				return 'Unsupported command: ' + this.value;
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for command: ' + this.value;
			default:
				return 'Invalid command';
		}
	}

	toMessage() {
		return super.toMessage().setCommand(this.getCommand());
	}

}

extend(InvalidCommandError.prototype, {
	code: ErrorCodes.INVALID_COMMAND
});

module.exports = InvalidCommandError;
