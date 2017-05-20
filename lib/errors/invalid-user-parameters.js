var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	Commands     = req('/lib/constants/commands');

var
	NeedMoreParamsMessage = req('/lib/server/messages/need-more-params');

class InvalidUserParametersError extends BaseError {

	getCommand() {
		return Commands.USER;
	}

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for USER command: ' + this.value;

			default:
				return 'Invalid USER parameters: ' + this.value;
		}
	}

	toMessage() {
		var message = new NeedMoreParamsMessage();

		message.setAttemptedCommand(this.getCommand());

		return message;
	}

}

extend(InvalidUserParametersError.prototype, {
	code: ErrorCodes.INVALID_USER_PARAMETERS
});

module.exports = InvalidUserParametersError;
