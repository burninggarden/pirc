
var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	Replies      = req('/lib/constants/replies'),
	Commands     = req('/lib/constants/commands');


class InvalidTargetError extends BaseError {

	getBody() {
		switch (this.getReason()) {
			case ErrorReasons.UNKNOWN_TYPE:
				return 'Unrecognized target type: ' + this.value;
			case ErrorReasons.OMITTED:
				return 'Must supply a target type';
			case ErrorReasons.WRONG_FORMAT:
			default:
				return 'Invalid target string: ' + this.value;
		}
	}

	toReply() {
		var command = this.getCommand();

		switch (command) {
			case Commands.PRIVMSG:
				return this.toPrivateReply();

			default:
				return this.toGenericReply();
		}

	}

	toPrivateReply() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorCodes.WRONG_FORMAT:
				let reply = this.createReply(Replies.ERR_NOSUCHNICK);

				reply.setNick(this.getValue());

				return reply;

			default:
				return this.toGenericReply();
		}
	}

	toTopicReply() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.WRONG_FORMAT:
				let reply = this.createReply(Replies.ERR_NOSUCHCHANNEL);

				reply.setChannelName(this.getValue());

				return reply;

			default:
				return this.toGenericReply();
		}
	}

	toWhoisReply() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorCodes.WRONG_FORMAT:
				let reply = this.createReply(Replies.ERR_NOSUCHNICK);

				reply.setNick(this.getValue());

				return reply;

			default:
				return this.toGenericReply();
		}
	}

	toGenericReply() {
		var reason = this.getReason();

		switch (reason) {
			case ErrorReasons.OMITTED:
				return this.createReply(Replies.ERR_NEEDMOREPARAMS);

			default:
				console.log('IMPLEMENT: ' + reason);
				return super.toMessage();
		}
	}

}

extend(InvalidTargetError.prototype, {
	code: ErrorCodes.INVALID_TARGET
});

module.exports = InvalidTargetError;
