
var
	Message               = req('/lib/message'),
	ReplyNumericValidator = req('/lib/validators/reply-numeric');

var
	extend = req('/lib/utilities/extend');


class ReplyMessage extends Message {

	doSanityChecks() {
		this.validateReplyNumeric(this.getReplyNumeric());
	}

	getReplyNumeric() {
		return this.reply_numeric;
	}

	validateReplyNumeric(reply_numeric) {
		ReplyNumericValidator.validate(reply_numeric);
	}

}

extend(ReplyMessage.prototype, {
	reply_numeric: null
});


module.exports = ReplyMessage;
