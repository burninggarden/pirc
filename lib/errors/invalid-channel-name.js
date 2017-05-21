
var
	extend        = req('/lib/utilities/extend'),
	BaseError     = req('/lib/errors/base'),
	ErrorCodes    = req('/lib/constants/error-codes'),
	ErrorReasons  = req('/lib/constants/error-reasons'),
	createMessage = req('/lib/utilities/create-message'),
	ReplyNumerics = req('/lib/constants/reply-numerics'),
	Commands      = req('/lib/constants/commands');


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

	toMessage() {
		var command = this.getCommand();

		switch (command) {
			case Commands.JOIN:
			case Commands.MODE:
			case Commands.PART:
				let message = createMessage(ReplyNumerics.ERR_NOSUCHCHANNEL);

				return message.setChannelName(this.getValue());

			default:
				throw new Error('implement');
		}
	}

}

extend(InvalidChannelNameError.prototype, {
	code: ErrorCodes.INVALID_CHANNEL_NAME
});

module.exports = InvalidChannelNameError;
