
var
	Message        = req('/lib/message'),
	ReplyValidator = req('/lib/validator/reply');

var
	extend = req('/lib/utility/extend');


class ReplyMessage extends Message {

	validateReply(reply) {
		ReplyValidator.validate(reply);
	}

	setTarget(target) {
		if (this.hasTarget()) {
			throw new Error('duplicate target');
		}

		return super.setTarget(target);
	}

}

extend(ReplyMessage.prototype, {
	reply: null
});


module.exports = ReplyMessage;
