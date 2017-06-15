var
	extend       = req('/lib/utilities/extend'),
	BaseError    = req('/lib/errors/base'),
	ErrorCodes   = req('/lib/constants/error-codes'),
	ErrorReasons = req('/lib/constants/error-reasons'),
	Replies      = req('/lib/constants/replies');


class NotYetImplementedError extends BaseError {

	getBody() {
		return 'Not yet implemented: ' + this.value;
	}

	toReply() {
		var reply = this.createReply(Replies.ERR_NOTIMPLEMENTED);

		reply.setBody(this.getBody());

		return reply;
	}

}

extend(NotYetImplementedError.prototype, {
	code:   ErrorCodes.NOT_YET_IMPLEMENTED,
	reason: ErrorReasons.NOT_YET_IMPLEMENTED
});

module.exports = NotYetImplementedError;
