
var
	extend     = req('/lib/utilities/extend'),
	BaseError  = req('/lib/errors/base'),
	ErrorCodes = req('/lib/constants/error-codes');

class InvalidCommandMessageError extends BaseError {

	getBody() {
		return 'Invalid command message: ' + this.value;
	}

}

extend(InvalidCommandMessageError.prototype, {
	code: ErrorCodes.INVALID_COMMAND_MESSAGE
});

module.exports = InvalidCommandMessageError;
