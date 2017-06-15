
var
	Message        = req('/lib/message'),
	ReplyValidator = req('/lib/validators/reply');

var
	extend = req('/lib/utilities/extend');


class ReplyMessage extends Message {

	validateReply(reply) {
		ReplyValidator.validate(reply);
	}

}

extend(ReplyMessage.prototype, {
	reply: null
});


module.exports = ReplyMessage;
