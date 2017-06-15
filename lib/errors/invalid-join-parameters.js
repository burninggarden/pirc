var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	Commands     = req('/lib/constants/commands'),
	Replies      = req('/lib/constants/replies');


class InvalidJoinParametersError extends BaseError {

	getCommand() {
		return Commands.JOIN;
	}

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for JOIN command: ' + this.value;

			default:
				return 'Invalid JOIN parameters: ' + this.value;
		}
	}

	toReply() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return this.createReply(Replies.ERR_NEEDMOREPARAMS);

			default:
				throw new Error('implement: ' + reason);
		}
	}

}

extend(InvalidJoinParametersError.prototype, {
	code: ErrorCodes.INVALID_JOIN_PARAMETERS
});

module.exports = InvalidJoinParametersError;
