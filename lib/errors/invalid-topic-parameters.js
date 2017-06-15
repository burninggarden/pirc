var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	Commands     = req('/lib/constants/commands'),
	Replies      = req('/lib/constants/replies');


class InvalidTopicParametersError extends BaseError {

	getCommand() {
		return Commands.TOPIC;
	}

	getBody() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_ENOUGH_PARAMETERS:
				return 'Not enough parameters for TOPIC command: ' + this.value;

			default:
				return 'Invalid TOPIC parameters: ' + this.value;
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

extend(InvalidTopicParametersError.prototype, {
	code: ErrorCodes.INVALID_TOPIC_PARAMETERS
});

module.exports = InvalidTopicParametersError;
