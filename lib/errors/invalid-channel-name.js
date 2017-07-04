
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	Replies      = req('/lib/constants/replies');


class InvalidChannelNameError extends BaseError {

	getBody() {
		switch (this.reason) {
			case ErrorReasons.OMITTED:
				return 'You must specify a channel name';
			case ErrorReasons.INVALID_CHARACTERS:
				return 'Invalid channel name: ' + this.getChannelName();
			case ErrorReasons.NOT_FOUND:
				return 'Channel did not exist: ' + this.getChannelName();
			default:
				return 'Invalid channel name: ' + this.reason;
		}
	}

	getChannelName() {
		return this.value;
	}

	toReply() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.NOT_FOUND:
				let reply = this.createReply(Replies.ERR_NOSUCHCHANNEL);

				return reply.setChannelName(this.getValue());

			default:
				throw new Error('implement handling for reason: ' + reason);
		}
	}

}

extend(InvalidChannelNameError.prototype, {
	code: ErrorCodes.INVALID_CHANNEL_NAME
});

module.exports = InvalidChannelNameError;
